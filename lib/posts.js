import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

const dataDir = path.join(process.cwd(), 'data')

const canopiesFileName = path.resolve(dataDir, 'canopies.json');
const manufacturersFileName = path.resolve(dataDir, 'manufacturers.json');

// helper function compareName
function compareName(canopies, c1, c2) {
  // console.log('compnam')
  // console.log(Object.keys(canopies).length)
  // console.log(c1)
  // console.log(c2)
  let n1 = canopies[c1].name;
  let n2 = canopies[c2].name;
  return n1.localeCompare(n2);
}

// helper function compareName
function compareCategory(canopies, c1, c2) {
  let n1 = canopies[c1].calculationcategory.toString();
  let n2 = canopies[c2].calculationcategory.toString();
  return n1.localeCompare(n2);
}

// helper function compareName
function compareManufacturer(canopies, manufacturers, c1, c2) {
  // console.log('compman')
  // console.log(Object.keys(canopies).length)
  // console.log(Object.keys(manufacturers).length)
  // console.log(c1)
  // console.log(c2)
  let m1 = manufacturers[canopies[c1].manufacturerid].name;
  let m2 = manufacturers[canopies[c2].manufacturerid].name;
  return m1.localeCompare(m2);
}

// create a slug
function slugify(text) {
  let slug = text.toLowerCase()
    .replace(/ /g, '_')
    .replace(/ō/g, 'o') // for ōm
    .replace(/[^\w-]+/g, '');
  return slug;
}

function cleanForSearch(text) {
  let search = text.trim().toLowerCase();
  search = search
    .replace(/ō/g, 'o') // for ōm
    .replace(/[ ,\-()]+/g, '');
  return search;
}

function getCanopyData() {

  let manufacturers = {};
  let canopies = {};
  
  let canopiesByName = [];
  let canopiesByManufacturer = [];
  let canopiesByCategory = [];
  
  let guidsSeen = {};
  let slugsSeen = {};

  const canopiesJson = fs.readFileSync(canopiesFileName);
  const manufacurersJson = fs.readFileSync(manufacturersFileName);

  const canopiesArray = JSON.parse(canopiesJson).canopies;
  const manufacturersArray = JSON.parse(manufacurersJson).manufacturers;

  // console.log(canopiesArray.length)
  // console.log(manufacturersArray.length)


  // create manufacturers Object
  for (let m in manufacturersArray) {
    let mObject = manufacturersArray[m];
    let id = mObject.id;
    if (guidsSeen[id]) {
      console.log('ERROR: Duplicate manufacturer id: ' + id);
    }
    guidsSeen[id] = 1;
    mObject.slug = slugify(mObject.name);
    if (slugsSeen[mObject.slug]) {
      console.log('ERROR: Duplicate slug: ' + mObject.slug);
    }
    slugsSeen[mObject.slug] = mObject.id;
    manufacturers[id] = mObject;
  }

  // create canopies Object
  let currentCategory = 0;
  for (let c in canopiesArray) {
    let cObject = canopiesArray[c];
    let id = cObject.id;
    if (guidsSeen[id]) {
      console.log('ERROR: Duplicate canopy id: ' + id);
    }
    guidsSeen[id] = 1;

    // complete URLS in the links array
    let links = [];
    if (cObject.dropzoneid) {
      links.push({
        type: "dropzone.com",
        title: "Dropzone.com",
        url: 'https://www.dropzone.com/gear/main-canopies/' + cObject.dropzoneid
      });
    }
    if (cObject.links) {
      for (var li = 0; li < cObject.links.length; li++) {
        let link = {};
        let url;
        link.type = cObject.links[li].type;
        link.title = cObject.links[li].title;
        switch (link.type) {
          case 'youtube':
            url = "https://www.youtube.com/watch?v=" + cObject.links[li].id;
            break;
          case 'vimeo':
            url = "https://vimeo.com/" + cObject.links[li].id;
            break;
          case 'skydivemag':
            url = "http://www.skydivemag.com/new/" + cObject.links[li].id;
            break;
          case 'pdf':
            url = cObject.links[li].id;
            break;
          default:
            throw new Error("Unknown link type: " + link.type);
        }
        link.url = url;
        links.push(link);
      }
    }
    cObject.links = links;
    cObject.commontype = parseInt(cObject.commontype);
    cObject.category = parseInt(cObject.category); // make sure we have int
    cObject.displaycategory = cObject.category ? cObject.category : '?';
    cObject.calculationcategory = cObject.category ? cObject.category : cObject.xbraced ? 7 : 6;
    cObject.manufacturername = manufacturers[cObject.manufacturerid].name;
    cObject.manufacturerurl = manufacturers[cObject.manufacturerid].url || null;
    cObject.manufacturerslug = manufacturers[cObject.manufacturerid].slug;
    cObject.search = cleanForSearch(cObject.name) + "|" + cleanForSearch(cObject.manufacturername);
    cObject.slug = slugify(cObject.manufacturername) + "-" + slugify(cObject.name);
    if (slugsSeen[cObject.slug]) {
      console.log('ERROR: Duplicate slug: ' + cObject.slug);
    }
    if (cObject.displaycategory === '?') {
      console.log('WARN: no category for: ' + cObject.manufacturername + ' ' + cObject.name);
    }
    slugsSeen[cObject.slug] = cObject.id;

    canopies[id] = cObject;
    canopiesByName.push(id);
    canopiesByManufacturer.push(id);
    canopiesByCategory.push(id);
    if (cObject.category < currentCategory) {
      console.log('category out of order for: ' + cObject.name + ' by ' + cObject.manufacturername);
    }
    if (cObject.calculationcategory > currentCategory) {
      currentCategory = cObject.calculationcategory;
    }
  }

  // sort by name (and then manufacturer)
  canopiesByName.sort((a, b) => {
    let nc = compareName(canopies, a, b);
    return nc !== 0 ? nc : compareManufacturer(canopies, manufacturers, a, b)
  })

  // sort by manufacturer (and then name)
  canopiesByManufacturer.sort((a, b) => {
    let mc = compareManufacturer(canopies, manufacturers, a, b);
    return mc !== 0 ? mc : compareName(canopies, a, b);
  })


  // sort by category (and then name, and then manufacturer)
  canopiesByCategory.sort((a, b) => {
    let cc = compareCategory(canopies, a, b);
    if (cc !== 0) {
      return cc;
    }
    let nc = compareName(canopies, a, b);
    return nc !== 0 ? nc : compareManufacturer(canopies, manufacturers, a, b)
  })

  const data = {
    manufacturers: manufacturers,
    canopies: canopies,
    canopiesByName: canopiesByName,
    canopiesByManufacturer: canopiesByManufacturer,
    canopiesByCategory: canopiesByCategory,
    slugs: slugsSeen
  }

  return data

}

export function getSortedCanopyData() {
  const data = getCanopyData()
  const sortedCanopyData =  data.canopiesByName.map((id) => data.canopies[id])
  console.log(sortedCanopyData)
  return sortedCanopyData
}






export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })

  // console.log(allPostsData)

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
      return {
        params: {
          id: fileName.replace(/\.md$/, '')
        }
      }
    })
  }
  
  export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
  
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()
  
    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data
    }
  }
  