import React, {useState, useEffect} from 'react';
import {EVENT_TYPE} from '../services/constant'

const apiBaseUrl=process.env.REACT_APP_API_BASE_URL;



//const imgHome=require('images/menu/annaAndMartin.png');
//const imgHome=require('images/menu/DanielAnna.png');
//const imgHome=require('images/menu/VastraHamnenSvartVit.png');

const imgs = {
  dance:require('../images/menu/dance.png'),
  calendar:require('../images/menu/calendar.png'),
  shoes:require('../images/menu/shoes.png'),
  studio:require('../images/menu/studio.png'),
  easter:require('../images/banner/easter_banner.jpg'),
  summer:require('../images/banner/summer_banner.jpg'),
  festivalito:require('../images/banner/festivalito_banner.jpg'),
  default:require('../images/banner/festivalito_banner.jpg'),
} 

const IMAGES=[
    {img:imgs.dance, 
      active:true, 
      open:false, // Left menu open when hover
      backgroundColor:'#8a973b', 
      opacity:0.6, 
      link:'/scheduleBeginner', 
      title:{EN:'BEGINNERS', SV:'GRUNDKURS', ES:'BEGINNERS'},
      hoverText:{SV:'Grundkurs för nybörjarei Tango',
                EN:'Start dance tango, courses for beginners',
                ES:'Start dance tango, courses for beginners',
      },
    },
    {img:imgs.dance, 
      active:true, 
      open:false, // Left menu open when hover
      backgroundColor:'#81185B', 
      opacity:0.6, 
      link:'/dance', 
      title:{EN:'DANCE', SV:'DANSA', ES:'DANZA'},
      hoverText:{SV:'Kursanmälan, Social Dans, Privatlektioner, Företag, Lärare',
                EN:'Courses, Registrations, Social dancing, Private lessons, Copmainies, Teachers', 
                ES:'Cursos, Registro, Baile social, Lecciones, Acuredo de negocios, Maestro'
      },
    },
    {img:imgs.shoes, 
      active:true, 
      open:false,
      backgroundColor:'#81185B', 
      opacity:0.6, 
      link:'/shop', 
      title:{EN:'SHOE STORE', SV:'SKOAFFÄR', ES:'ZAPATERIA'},
      hoverText:{EN:'Shoe store / Shoe showroom', 
                SV:'Skoaffär / Showroom',
                ES:'Zapatos / Sala de exposoción'
      }, 
    },
    {img:imgs.studio, 
      active:true, 
      open:false,
      backgroundColor:'#8a973b', 
      opacity:0.6, 
      link:'/studio', 
      title:{EN:'RENT LOCAL', SV:'HYR LOKAL', ES:'ALQUILAR LOCAL'},
      hoverText:{EN:'Party room for rent', 
                SV:'Festlokal för uthyrning',
                ES:'Habitacion en alquiler'
      }, 
    },
    {img:imgs.summer, 
      active:true,  
      eventType:EVENT_TYPE.SUMMER,
      open:false,
      backgroundColor:'lightGreen', 
      opacity:0.6, 
      link:'/summer',
      title:{EN:'SUMMER', SV:'SOMMAR', ES:'SUMMER'},
      hoverText:{EN:'Summer festival', 
                SV:'Sommarfestival',
                ES:'Summer festival'
      }, 
    },
    {img:imgs.festivalito, 
      active:true,  
      eventType:EVENT_TYPE.FESTIVALITO,
      open:false,
      backgroundColor:'red', 
      opacity:0.6, 
      link:'/festivalito',
      title:{EN:'FESTIVALITO', SV:'FESTIVALITO', ES:'FESTIVALITO'},
      hoverText:{EN:'FESTIVALITO', SV:'FESTIVALITO', ES:'FESTIVALITO'},
    }, 
    {img:imgs.easter, 
        active:true,  
        eventType:EVENT_TYPE.EASTER,
      open:false,
      backgroundColor:'brown', 
      opacity:0.6, 
      link:'/easter',
      title:{EN:'EASTER FESTIVAL', SV:'PÅSKFESTIVAL', ES:'EASTER FESTIVAL'},
      hoverText:{EN:'EASTER FESTIVAL', SV:'PÅSKFESTIVAL', ES:'EASTER FESTIVAL'},
    },
    {img:imgs.default, 
      eventType:EVENT_TYPE.WEEKEND,
      open:false,
      backgroundColor:'lightBlue', 
      opacity:0.6, 
      link:'/weekend',
      hoverText:{EN:'Course during one or multiple weekends', 
                SV:'Kurs som pågår under en eller flera helger',
                ES:'Curso durante uno o varios fines de semana'
      }, 
    },
    {img:imgs.default, 
      eventType:EVENT_TYPE.SEMINAR,
      open:false,
      backgroundColor:'deepOrange', 
      opacity:0.6, 
      link:'/seminar',
      hoverText:{EN:'', 
                SV:'',
                ES:''
      }, 
    },
    {img:imgs.default, 
      eventType:EVENT_TYPE.DEFAULT,
      open:false,
      backgroundColor:'whiteSmoke', 
      opacity:0.6, 
      link:'/default', 
      hoverText:{EN:'', 
                SV:'',
                ES:''
      }, 
    }, 
    {img:imgs.default, 
      eventType:EVENT_TYPE.DEFAULT,
      open:false,
      backgroundColor:'whiteSmoke', 
      opacity:0.6, 
      hoverText:{EN:'', 
                SV:'',
                ES:''
      }, 
    }, 
    /*
    {img:require('images/banner/maraton_banner.jpg'), 
      eventType:EVENT_TYPE.MARATHON,
      active:false, 
      open:false,
      backgroundColor:tkColors.Easter.Light, 
      opacity:0.6, 
      link:'/malmotangomarathon', 
      title:{EN:'MARATHON', SV:'MALMOTANGOMARATON', ES:'MARATHON'},
      hoverText:{EN:'Malmp Tango Marathon', 
                SV:'Malmö tango marathon',
                ES:'Habitacion en alquiler'
      }, 
    },
    */
]

// ALQUILAR EL ESTUDIO

const _imageStyleNew = (width, height, img, opacity, hover, backgroundColor) => ({
  container: {
    position: 'relative',
    float:'left',
    width,
    overflow:'hide',
    cursor:'pointer',
    backgroundColor,
    objectFit:'cover',
    zIndex:20,
  },
  image: {
    position:'relative',
    display: 'block',
    height,  
    padding:'1%',
    backgroundColor,
    /*
    backgroundImage:`url(${img})`,
    backgroundSize:'cover',
    overflow:'hidden',
    */
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    backgroundColor,
    opacity:hover?1.0:opacity,
    transition: '.5s ease',
  },
  text:{
    position:'absolute',
    top: '50%',
    left: width==='100%'?'100%':'50%',
    transform: 'translate(-50%, -50%)',
    color:'white',
    fontSize:width==='100%'?18:12,
    fontWeight:400,
    fontStyle:'italic',
    cursor:'pointer',
  },

  text1: {
    position: 'absolute',
    color: 'blue',
    fontSize: 20,
    top: '50%',
    left: width==='100%'?'75%':'50%',
    transform: 'translate(-50%, -50%)',
  },
  link:{
    textDecoration:'none'
  },
})

const styles = {
  root:{
    //backgroundColor:'whiteSmoke',
    //background:"linear-gradient(45deg, orange 0%, teal 100%)",
    color:'whiteSmoke'
  }  
}


const _imageStyle = (width, height, img, opacity, hover, backgroundColor) => ({
  container:{
    position: 'relative',
    float:'left',
    width,
    textAlign:'center',
    cursor:'pointer',
    overflow:'hide',
    zIndex:20,
    backgroundColor:'whiteSmoke',
  },
  image:{
    position:'relative',
    display:'block',
    margin:1,
    height,
    backgroundColor:'yellow',
    backgroundImage:`url(${img})`,
    backgroundSize:'cover',
    overflow:'hidden',
    borderRadius:height > 25?0:8,
    // border:hover?'3px solid ' + backgroundColor:null,
    // borderColor:backgroundColor,
    cursor:'pointer',

  },
  overlay:{
    position:'absolute',
    width:'100%', 
    height:'100%', 
    backgroundColor,
    cursor:'pointer',
    opacity:hover?1.0:opacity, 
    transition: '1000ms all ease',
    willChange: 'opacity',
  },
  text:{
    position:'absolute',
    top: '50%',
    left: hover?'50%':width==='100%'?'75%':'50%',
    transform: 'translate(-50%, -50%)',
    color:width==='100%'?'white':backgroundColor,
    fontSize:width==='100%'?22:16,
    fontWeight:width==='100%'?300:300,
    fontStyle:'italic',
    cursor:'pointer',
    opacity:hover?1.0:0, 
    transition: '1000ms all ease',
    willChange: 'opacity',
  },
  textInverse:{
    position:'absolute',
    top: '50%',
    left: hover?'50%':width==='100%'?'75%':'50%',
    transform: 'translate(-50%, -50%)',
    color:width==='100%'?'white':'whiteSmoke',
    fontSize:width==='100%'?22:18,
    fontWeight:width==='100%'?300:300,
    fontStyle:'italic',
    cursor:'pointer',
    opacity:hover?0:1.0, 
    transition: '1000ms all ease',
    willChange: 'opacity',
  },
  link:{
    textDecoration:'none'
  },
})

const _ImageNew = (im, hover, width, height, language, handleClick, gtMobile) =>  {
  const {img, link, title, backgroundColor}=im;
  const opacity = hover?0.5:im.opacity
  const imageStyle = _imageStyleNew(width, height, img, opacity, hover, backgroundColor);
  return (
    <div style={imageStyle.container} onClick = {()=>handleClick(link)}>
      <img  src={img} style={imageStyle.image} />
      <div style={imageStyle.overlay}></div>
      <small style={imageStyle.text}>{hover?im.hoverText[language]:title[language]}</small>
    </div>
  )
}    

const _Image = (image, hover, width, height, language, handleClick) =>  {
    const {img, link, hoverText, backgroundColor, overlayColor}=image;
    const title = image.title?image.title[language].toUpperCase():undefined
    const opacity = hover?0.1:image.opacity 
    const imageStyle = _imageStyle(width, height, img, opacity, hover, overlayColor?overlayColor:backgroundColor);
    const altText = hoverText[language]?hoverText[language].length > 0?hoverText[language]:title:title
    return (

      <div style={imageStyle.container} onClick = {()=>handleClick(link)} >
        <div  style={imageStyle.image}>
            <div style={imageStyle.overlay}/>
        </div> 
        <small style={{...imageStyle.text, fontSize:14}}>{altText}</small>
        <div style={imageStyle.textInverse}>{title}</div>
      </div>
    )
}

const Menu = props => {
  const language = 'SV' 
  const [images, setImages] = useState(IMAGES)
  const [hoverIndex, setHoverIndex] = useState(undefined)
  const height = '25vh'

  const handleMouseEnter = index => {
    setHoverIndex(index)
  }

  const handleMouseLeave = () => {
    setHoverIndex(undefined)
  }

  const handleClick = link => {
    setHoverIndex(undefined)
    alert('This should call a some link for option ' + link)
  }
  useEffect(()=>{
    const staticImages = IMAGES.filter(im => im.active?im.active:false)  
    const images =  staticImages
    setImages(images)
  }, [props.list])  
  return(      
    <div className='columns is-centered is-gapless' style={styles.root}>
      {images.map((image, index) =>
        <>
            <div className='column is-hidden-tablet is-full'
                onMouseEnter={()=>handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                key={index} 
                >
                {_Image(image, 
                    false, 
                    '100%', 
                    '12vh', 
                    language, 
                    handleClick)
                }
            </div>
            <div className='column is-hidden-mobile'
                // data-tip={im.hoverText[language]}
                onMouseEnter={()=>handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                key={index} 
                >
                {_Image(image, 
                    hoverIndex===index, 
                    '100%', 
                    '5vh', 
                    language, 
                    handleClick)
                }
            </div>
        </>

      )}
      {/*geMobileLandscape===true?<ReactTooltip />:null*/}
      <div style={{clear:'both'}} />
    </div>
  )   
}    

const mapStateToProps = state => {
  return {
    list: state.eventSchedule.list,
  }
}


export default Menu
 

