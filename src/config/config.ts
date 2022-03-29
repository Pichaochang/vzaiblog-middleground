interface sysConfigTs {
  baseUrl: string
}
function getUrlConfig():sysConfigTs {
  var IS_LOCAL_ADDRESS = window.location.hostname
  const localtion = {
    baseUrl: 'http://localhost:7001'
  }
  const production = {
    baseUrl: 'http://124.223.34.50:7001'
  }
  
  const config:any = {
    'localhost': localtion,
    'www.zhangbizhao.xyz': production
  }
  return config[IS_LOCAL_ADDRESS]
} 
export const sysConfig = getUrlConfig()