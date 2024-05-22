import { generateEditorStateFromValue, emptyEditorState } from '../components/DraftEditor'

export const labelSwedish = name => {
    switch (name.toLowerCase()) {
        case 'goteborg':return 'Göteborg'
        case 'malmö':return 'Malmö/Lund'
        case 'jamtland':return 'Jämtland'
        default: return name.toLowerCase()
    }
}

export const replaceSwedishChars = value => {
    return value
      .replace(/å/g, 'a')
      .replace(/Å/g, 'A')
      .replace(/ä/g, 'a')
      .replace(/Ä/g, 'A')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O');
}

export const replaceChar = (origString, replaceChar, index) => {
    let firstPart = origString.substring(0, index);
    let lastPart = origString.substring(index + 1);
      
    let newString = firstPart + replaceChar + lastPart;
    return newString;
}

export const isEmail = value => {
    var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return value.toLowerCase().match(validRegex)?true:false 
}    

export const styleSquare = userSettings=>{
    const color = userSettings.color
    const background = 'linear-gradient(to bottom right, ' + userSettings.backgroundColorLight + ' ,' + userSettings.backgroundColorDark + ')'
    const borderWidth = userSettings.borderWidth
    const borderColor = userSettings.borderColor
    const backgroundColor = userSettings.backgroundColorLight
    const backgroundImage = `url(${userSettings.backgroundImage})`
    return(
        
    userSettings.backgroundImage?
        {textAlign:'center', color, backgroundSize:'50% 100%', backgroundImage:backgroundImage, backgroundColor, borderStyle:'solid', borderWidth, borderColor}
    :
        {width:300, height:150, textAlign:'center', color, background, borderStyle:'solid', borderWidth, borderColor}
    )
}        

export function getTypeFromColumnType (column) {
    const columnType = column.Type.split('(')[0]
    switch(columnType) {
        case 'tinyint':
            return 'checkbox' 
        case 'interger':
            return 'number'
        case 'text':
                return 'textarea'
            case 'varchar':
            const length = column.Type.split('(')[1].split(')')[0]
            if (length > 1000) {
                return 'textarea'
            } else {
                return 'text' 
            }    
            break
        case 'varchar':
        default:
            return 'text'
    }        
}

export const uniqueList = list => {return([...new Set(list)])}


export const uniqueObjectList = (list, label) => {
    const uniqueLabels = list.map(it => it[label]).filter((value, index, current_value) => current_value.indexOf(value) === index);
    return uniqueLabels.sort((a,b)=>a.localeCompare(b)).map(lbl=>list.find(it=>it[label] === lbl))
};

export const getType = p => {
    if (Array.isArray(p)) return 'array'
    else if (typeof p == 'string') return 'string'
    else if (p != null && typeof p == 'object') return 'object'
    else if (!Number.isNaN(p)) return 'number'
    else return 'other'
}

export const isNormalVariable = p => {
    const type = getType(p)
    // return (type === 'string' || type === 'number' || type==='other')
    return true
}
    
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




    




