export const PRODUCTION = process.env.NODE_ENV === 'production'
export const DEVELOPMENT = process.env.NODE_ENV === 'development'

export const STATUS_STYLE={
    DEFAULT:{backgroundColor:'gray', color:'white'},
    OK:{backgroundColor:'green', color:'white'},
    WARNING:{backgroundColor:'yellow', color:'black'},
    ERROR:{backgroundColor:'red', color:'white'},
}

export const EVENT_TYPE = {
    MARATHON:'MARATHON',
    EASTER:'EASTER',
    SUMMER:'SUMMER',
    FESTIVALITO:'FESTIVALITO'
}

