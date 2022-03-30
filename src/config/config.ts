interface sysConfigTs {
  baseUrl: string
}
function getUrlConfig():sysConfigTs {
  var IS_LOCAL_ADDRESS = window.location.hostname
  const localtion = {
    baseUrl: 'http://localhost:7001'
    // baseUrl: 'https://www.zhangbizhao.xyz'
  }
  const production = {
    baseUrl: 'https://www.zhangbizhao.xyz'
  }
  
  const config:any = {
    'localhost': localtion,
    'www.zhangbizhao.xyz': production
  }
  return config[IS_LOCAL_ADDRESS]
} 
export const sysConfig = getUrlConfig()