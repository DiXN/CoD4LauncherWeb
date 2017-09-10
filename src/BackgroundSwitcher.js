import React, { Component } from 'react';

class BackgroundSwitcher extends Component {
  constructor(props) {
    super(props)

    this.imageNames = Array.apply(null, {length: 20}).map(Number.call, Number).map((i) => `wallpaper${i + 1}`)

    this.getRndNumber = () => Math.floor((Math.random() * this.imageNames.length) + 1)

    this.state = {
      imageUrls:[],
      rndImage: this.getRndNumber()
    }
  }

  setWallpaper = (img) => {
    import(`./img/wallpaper/${img}.jpg`)
    .then(mapImage => {
      this.setState({
        imageUrls: [...this.state.imageUrls, `url("${mapImage}")`]
      })
    })
  }

  componentDidMount() {
    this.imageNames.forEach((element) => {
      this.setWallpaper(element)
    })  

    setInterval(() => {
      this.setState({
        rndImage: this.getRndNumber()
      })
    }, this.props.timeout);
  }

  render() {
    const styles = {
      div: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        display: 'inline-block'
      },
      img: {
        opacity: 0,
        transition: 'opacity 1.5s',
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }
    }

    const imgContainer = this.state.imageUrls.map((img, key) => {
      if((key + 1) === this.state.rndImage) {
        return <div key={key} style={{...styles.img, ...{backgroundImage: img, opacity: 1}}}/>
      } else {
        return <div key={key} style={{...styles.img, backgroundImage: img}}/>
      }
    })

    return (
      <div style={styles.div}>
        {imgContainer}
      </div>
    )
  }
}

export default BackgroundSwitcher;