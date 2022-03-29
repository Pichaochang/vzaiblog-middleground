/** 这个文件封装了一些常用的工具函数 **/

const tools = {
  /**
   * 保留N位小数
   * 最终返回的是字符串
   * 若转换失败，返回参数原值
   * @param str - 数字或字符串
   * @param x   - 保留几位小数点
   */
  pointX(str: string | number, x = 0): string | number {
    if (!str && str !== 0) {
      return str;
    }
    const temp = Number(str);
    if (temp === 0) {
      return temp.toFixed(x);
    }
    return temp ? temp.toFixed(x) : str;
  },

  /**
   * 去掉字符串两端空格
   * @param str - 待处理的字符串
   */
  trim(str: string): string {
    const reg = /^\s*|\s*$/g;
    return str.replace(reg, "");
  },

  /**
   * 给字符串打马赛克
   * 如：将123456转换为1****6，最多将字符串中间6个字符变成*
   * 如果字符串长度小于等于2，将不会有效果
   * @param str - 待处理的字符串
   */
  addMosaic(str: string): string {
    const s = String(str);
    const lenth = s.length;
    const howmuch = ((): number => {
      if (s.length <= 2) {
        return 0;
      }
      const l = s.length - 2;
      if (l <= 6) {
        return l;
      }
      return 6;
    })();
    const start = Math.floor((lenth - howmuch) / 2);
    const ret = s.split("").map((v, i) => {
      if (i >= start && i < start + howmuch) {
        return "*";
      }
      return v;
    });
    return ret.join("");
  },

  /**
   * 验证字符串
   * 只能为字母、数字、下划线
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkStr(str: string): boolean {
    if (str === "") {
      return true;
    }
    const rex = /^[_a-zA-Z0-9]+$/;
    return rex.test(str);
  },

  /**
   * 验证字符串
   * 只能为数字
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkNumber(str: string): boolean {
    if (!str) {
      return true;
    }
    const rex = /^\d*$/;
    return rex.test(str);
  },

  /**
   * 正则 手机号验证
   * @param str - 待处理的字符串或数字
   * **/
  checkPhone(str: string | number): boolean {
    const rex = /^1[34578]\d{9}$/;
    return rex.test(String(str));
  },

  /**
   * 正则 邮箱验证
   * @param str - 待处理的字符串
   * **/
  checkEmail(str: string): boolean {
    const rex =
      /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    return rex.test(str);
  },

  /**
   * 字符串加密
   * 简单的加密方法
   * @param code - 待处理的字符串
   */
  compile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return c;
  },

  /**
   * 字符串解谜
   * 对应上面的字符串加密方法
   * @param code - 待处理的字符串
   */
  uncompile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  }, 

  /**
   * 清除一个对象中那些属性为空值的属性
   * 0 算有效值
   * @param {Object} obj  待处理的对象
   * **/
  clearNull<T>(obj: T): T {
    const temp: T = { ...obj };
    Object.keys(temp).forEach((key) => {
      // if (temp[key] !== 0 && !temp[key]) {
      //   delete temp[key];
      // }
    });
    return temp;
  },
  /**
* @description: 复制文本
* @param {string} text 复制文本
*/
 copyText(text:string) {
  // 数字没有 .length 不能执行selectText 需要转化成字符串
  const textString = text.toString()
  let input:HTMLInputElement| null = document.querySelector('#copy-input')
  if (!input) {
    input = document.createElement('input')
    input.id = 'copy-input'
    input.readOnly = true // 防止ios聚焦触发键盘事件
    input.style.position = 'absolute'
    input.style.left = '-1000px'
    input.style.zIndex = '-1000'
    document.body.appendChild(input)
  }

  input.value = textString
  // ios必须先选中文字且不支持 input.select();
  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  this.selectText(input, 0, textString.length)
  if (document.execCommand('copy')) {
    document.execCommand('copy')
  }
  input.blur()
},
/**
 * @description: ios选择input文本方法
 * @param {object} textbox dome元素
 * @param {number} startIndex 字符串索引0
 * @param {number} stopIndex 字符串索引长度
 */
 selectText(textbox: HTMLInputElement | any, startIndex: number, stopIndex: number) {
  if (textbox.createTextRange) { // ie
    const range = textbox.createTextRange()
    range.collapse(true)
    range.moveStart('character', startIndex)// 起始光标
    range.moveEnd('character', stopIndex - startIndex)// 结束光标
    range.select()// 不兼容苹果
  } else { // firefox/chrome
    textbox.setSelectionRange(startIndex, stopIndex)
    textbox.focus()
  }
}
};

export default tools;
