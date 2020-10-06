import { isThisSecond } from 'date-fns';

const cookie = require('cookie-cutter');

class Welcome extends React.Component {

    constructor(props) {
        super(props)

        let count = null
        if (process.browser) {
            let countCookie = cookie.get('counter')
            if (countCookie) {
                count = parseInt(countCookie)
            }
        }

        this.state = {
            count: count
        }
    }

    less = () => {
        var count = parseInt(cookie.get('counter')) || 0
        count -= 1
        cookie.set('counter', count)
        this.setState({count: count})
        console.log('less ' + count)
    }
    
    
    more = () => {
        var count = parseInt(cookie.get('counter')) || 0
        count += 1
        cookie.set('counter', count)
        this.setState({count: count})
        console.log('more ' + count)
    }
    


    render() {
        let counterText = '?'
        if (process.browser) {
          let counter = this.state.count
          if (counter || counter === 0) {
              counterText = parseInt(counter)
          }
        }
      
        const buttonStyle = {
          display: "inline-block"
        }
        const counterTextStyle = {
            border: "1x black",
            display: "inline-block",
            paddingLeft: "6px",
            paddingRight: "6px"
      
        }
        return (
          <div>
              <button style={buttonStyle} onClick={this.less}>-</button>
              <div style={counterTextStyle}>
                  {counterText}
              </div>
              <button style={buttonStyle} onClick={this.more}>+</button>
          </div>
        )
      }
      

}


export default Welcome