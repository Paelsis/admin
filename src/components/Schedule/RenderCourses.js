import React from 'react';
import RenderCoHeader from './RenderCoHeader'
import RenderCoRegHeader from './RenderCoRegHeader'
import RenderCoRegLine from './RenderCoRegLine'
import tkColors from 'Settings/tkColors';

const background = courseType => {
        switch (courseType) {
            case 'GK':return 'linear-gradient(45deg, #81185B 0%,  #330a41 100%)'
            case 'FK':return 'linear-gradient(45deg, #81185B 0%,  #330a41 100%)'
            case 'HK':return 'linear-gradient(45deg, blue 0%,  #330a41 100%)'
            case 'TE':return 'linear-gradient(45deg, red 0%,  #330a41 100%)'
            case 'XX':return 'linear-gradient(45deg, orange 0%,  #330a41 100%)'
        }    
    }
    
const boxColor = courseType => {
switch (courseType) {
        case 'GK':return '#81185B'
        case 'FK':return '#81185B'
        case 'HK':return 'blue'
        case 'TE':return 'red'
        case 'XX':return 'orange'
}    
}

    

const styles = {
        course: (courseType) =>({
            maxWidth:550,
            height:'min-content',
            margin:4,
            background: background(courseType),
            color:'#f6d8e6',
            //border:'0.001px solid',
            boxShadow:'0 13px 27px -5px ' + boxColor(courseType),
    
            // boxShadow:'0px 13px 27px -5px rgba(50, 50, 93, 0.25), 0px 8px 16px -8px rgba(0, 0, 0, 0.3)',        
            borderColor:tkColors.Purple.Light,
            borderRadius:12,
        }),
        th:{
                textAlign:'center',
                verticalAlign:'middle',
                padding:2,
                fontSize:12,
                color:'white',
        }
};
    

// RenderCoRegHeader
const RenderCoRegHeader = ({language, weekend, style}) => 
        <tr>
            {weekend?null
            :
                <>
                    <th style={style}>{language==='SV'?'Veckodag':language==='EN'?'Day':'Día'}</th>
                    <th style={style}>{language==='SV'?'Tid':language==='EN'?'Time':'Tiempo'}</th>
                </>
            }
            <th style={style}>{language==='SV'?'Stad':language==='EN'?'City':'Ciudad'}</th>
            <th style={style}>{language==='SV'?'Kursstart':language==='EN'?'Start':'Comienzo'}</th>
            <th style={style}>{language==='SV'?'Lärare':language==='EN'?'Teachers':'Maestro'}</th>
            <th/> 
        </tr>
   
    
    

// RenderCourses
export default ({courses, language, setTextId}) => {
        const list = courses.filter(it=>it.active !== '0').sort((a,b)=> a.dayOfWeek - b.dayOfWeek)
        return (
                <table className="table-schema" key={courses[0].courseId} style={styles.course(courses[0].courseType)}>
                        <RenderCoHeader course = {courses[0]} language={language} handleClick={()=>setTextId(courses[0].textId)}/>    
                        <RenderCoRegHeader style={styles.th} language = {language} weekend={courses[0].courseType === 'HK'?true:undefined}/>
                        <tbody>
                                {list.map(course => <RenderCoRegLine course={course} color='white' language={language} />)}  
                        </tbody>
                </table>   
        ) 
}
    