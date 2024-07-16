import { generateEditorStateFromValue, emptyEditorState } from '../components/DraftEditor'

    
export const labelSwedish = name => {
    switch (name.toLowerCase()) {
        case 'goteborg':return 'Göteborg'
        case 'malmö':return 'Malmö/Lund'
        case 'jamtland':return 'Jämtland'
        default: return name.toLowerCase()
    }
}

export const dayName = [
    {SV:'Söndag', EN: 'Sunday'},
    {SV:'Måndag', EN: 'Monday'},
    {SV:'Tisdag', EN: 'Tuesday'},
    {SV:'Onsdag', EN: 'Wednesday'},
    {SV:'Torsdag', EN: 'Thursday'},
    {SV:'Fredag', EN: 'Friday'},
    {SV:'Lördag', EN: 'Saturday'},
]


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

export function calcAmount(packages, workshops, currency) {
    const PRODUCT_TYPE={
        // Workshops
        BASIC_WORKSHOP:'BASIC_WORKSHOP',
        REGULAR_WORKSHOP:'REGULAR_WORKSHOP',
        MILONGA:'MILONGA', 
    
        // Packages
        DANCE_PACKAGE:'DANCE_PACKAGE',  
        BASIC_PACKAGE:'BASIC_PACKAGE',
        REGULAR_PACKAGE:'REGULAR_PACKAGE',
    }
    const wsBasic = workshops.find(ws=>ws.productType===PRODUCT_TYPE.BASIC_WORKSHOP)
    const wsRegular = workshops.find(ws=>ws.productType===PRODUCT_TYPE.REGULAR_WORKSHOP)
    const priceBasic = wsBasic?Number(wsBasic.priceSEK):250
    const priceRegular = wsRegular?Number(wsRegular.priceSEK):250
    const foundLuxury = packages.find(pr=>pr.allWorkshops)
    const maxPrice = foundLuxury?Number(foundLuxury.priceSEK):10000
    const foundAllWorkshops = packages.find(it=>it.checked && it.allWorkshops)?true:false
    const dancePackageIncluded = packages.find(it => (it.productType === PRODUCT_TYPE.BASIC_PACKAGE || (it.productType === PRODUCT_TYPE.REGULAR_PACKAGE) && it.checked))?true:false 
    const dancePackageChecked = packages.find(it => (it.checked && (it.productType === PRODUCT_TYPE.DANCE_PACKAGE)))?true:false
    let cntWsBasic = 0
    let cntWsRegular = 0
    let cntWsPackageBasic = 0
    let cntWsPackageRegular = 0
    let amount = 0 

    if (foundAllWorkshops) {
        /* All workshops and milongas (luxury package) */
        return maxPrice;
    } else {
        packages.filter(pa=>pa.checked).forEach(pa=> {  
            switch (pa.productType) {
                case PRODUCT_TYPE.BASIC_PACKAGE:
                    cntWsPackageBasic += Number(pa.wsCount)
                    amount += pa?pa.priceSEK?Number(pa.priceSEK):-1000000:-2000000
                    break
                case PRODUCT_TYPE.REGULAR_PACKAGE:
                    cntWsPackageRegular += Number(pa.wsCount)
                    amount += pa?pa.priceSEK?Number(pa.priceSEK):-1000000:-2000000
                    break
                case PRODUCT_TYPE.DANCE_PACKAGE:
                    amount += dancePackageIncluded?0:(pa?pa.priceSEK?Number(pa.priceSEK):-1000000:-2000000)    
                    break    
            }    
        })    
        /* Packages and workshops */
        workshops.filter(ws=>ws.checked).forEach(ws=> {  
            // Workshop and package counters
            switch (ws.productType) {
                case PRODUCT_TYPE.BASIC_WORKSHOP:
                    cntWsBasic += ws.wsCount
                    // Add price if more than packages ws-count
                    if (cntWsBasic > cntWsPackageBasic) {
                        amount += ws?ws.priceSEK?Number(ws.priceSEK):-1000000:-2000000
                    }
                    break
                case PRODUCT_TYPE.REGULAR_WORKSHOP:
                    cntWsRegular += ws.wsCount
                    // Add price if more than packages ws-count
                    if (cntWsRegular > cntWsPackageRegular) {
                        amount += ws?ws.priceSEK?Number(ws.priceSEK):-1000000:-2000000
                    }    
                    break
                case PRODUCT_TYPE.MILONGA:
                    amount += (dancePackageIncluded || dancePackageChecked)?0:(ws?ws.priceSEK?Number(ws.priceSEK):-1000000:-2000000)    
                    break    
                }
        })        

        if (cntWsPackageBasic > 0 && cntWsBasic > cntWsPackageBasic) {
                amount += Math.max((cntWsBasic - cntWsPackageBasic - Math.max(cntWsPackageRegular - cntWsRegular, 0)), 0) * priceBasic
        }    

        amount = Math.min(amount, maxPrice) 
        return amount
    }
}

    




