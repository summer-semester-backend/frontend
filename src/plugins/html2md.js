/**
 * 把 html 内容转化为 markdown 格式 V1.0
 *
 * @author kohunglee
 * @param {string} htmlData 转换前的 html
 * @return {string} 转化后的 markdown 源码
 */
export function html2md(htmlData) {
  var codeContent = new Array(); // code标签数据
  var preContent = new Array(); // pre标签数据
  var tableContent = new Array(); // table标签数据
  var olContent = new Array(); // ol标签数据
  var imgContent = new Array(); // img标签数据
  var aContent = new Array(); // a标签数据
  let pureHtml = htmlData;

  // 源代码
  console.log('转换前的源码：' + pureHtml);

  // 函数：删去html标签
  function clearHtmlTag(sourceData = '') {
    return sourceData.replace(/\<[\s\S]*?\>/g, '').replace(/\[~wrap\]/g, '');
  }

  // 复原ol标签
  function olRecover(olData = '') {
    let result = olData;
    let num = olData.match(/\<li\>/gi).length;
    for (let i = 1; i <= num; i++) {
      let line = '[~wrap]';
      if (i == 1) line = '[~wrap][~wrap]';
      result = result.replace(/\<li\>/i, line + i + '. ');
    }
    result = result.replace(/\<\/li\>/, '');
    return result;
  }

  // 函数：复原img标签
  function imgRecover(imgHtml = '') {
    console.log(imgHtml);
    let imgSrc, imgTit, imgAlt, result;
    imgSrc = imgHtml.match(/(?<=src=['"])[\s\S]*?(?=['"])/i);
    imgTit = imgHtml.match(/(?<=title=['"])[\s\S]*?(?=['"])/i);
    imgAlt = imgHtml.match(/(?<=alt=['"])[\s\S]*?(?=['"])/i);

    imgTit = imgTit != null ? ` "${imgTit}"` : ' ';
    imgAlt = imgAlt != 'null' ? imgAlt : ' ';
    result = `![${imgAlt}](${imgSrc}${imgTit})`;
    console.log(result);
    return result;
  }

  // 函数：复原a标签
  function aRecover(aData = '') {
    let aHref = '' + aData.match(/(?<=href=['"])[\s\S]*?(?=['"])/i);
    let aTit = '' + aData.match(/(?<=title=['"])[\s\S]*?(?=['"])/i);
    let aText = '' + aData.match(/(?<=\<a\s*[^\>]*?\>)[\s\S]*?(?=<\/a>)/i);

    let aImg = aData.match(/<img\s*[^\>]*?\>[^]*?(<\/img>)?/i);
    let aImgSrc, aImgTit, aImgAlt;

    aTit = aTit != 'null' ? ` "${aTit}"` : ' ';
    aText = clearHtmlTag(aText);
    let result = `[${aText}](${aHref}${aTit})`;

    if (aImg != null) {
      // 函数：如果发现图片,则更换为图片显示模式
      aImgSrc = aImg[0].match(/(?<=src=['"])[\s\S]*?(?=['"])/i);
      aImgTit = aImg[0].match(/(?<=title=['"])[\s\S]*?(?=['"])/i);
      aImgAlt = aImg[0].match(/(?<=alt=['"])[\s\S]*?(?=['"])/i);

      aImgTit = aImgTit != null ? ` "${aImgTit}"` : ' ';
      aImgAlt = aImgAlt != 'null' ? aImgAlt : ' ';
      result = `[![${aImgAlt}](${aImgSrc}${aImgTit})](${aHref}${aTit})`;
    }
    return result;
  }

  // 函数：复原table标签
  function tableRecover(tableData = null) {
    /*if (tableData[0] == null) {
      // 如果不存在 th 标签，则默认表格为一层
      let result = '';
      let colNum = tableData[1].length;

      for (let i = 0; i < colNum; i++) {
        result += `|${clearHtmlTag(tableData[1][i])}`;
      }
      result += `|[~wrap]`;
      for (let j = 0; j < colNum; j++) {
        result += `| :------------: `;
      }
      result += `|[~wrap]`;
      return result;
    }*/
    let colNum = tableData[0].length; // 如果存在 th 标签，则按 th 的格数来构建整个表格
    let result = '';

    for (let i = 0; i < colNum; i++) {
      result += `|${clearHtmlTag(tableData[0][i])}`;
    }
    result += `|[~wrap]`;
    console.log(result);
    for (let j = 0; j < colNum; j++) {
      result += `| :------------: `;
    }
    result += `|[~wrap]`;
    for (let i = 1; i < tableData.length; i++) {
      for (let k = 0; k < colNum; k++) {
        result += `|${clearHtmlTag(tableData[i][k])}`;
      }
      result += `|[~wrap]`;
    }
    return result;
  }
  // 去掉样式和脚本极其内容
  pureHtml = pureHtml
    .replace(/<style\s*[^\>]*?\>[^]*?<\/style>/gi, '')
    .replace(/<script\s*[^\>]*?\>[^]*?<\/script>/gi, '');

  // 储存pre的内容,并替换<pre>中的内容
  preContent = pureHtml.match(/<pre\s*[^\>]*?\>[^]*?<\/pre>/gi);
  pureHtml = pureHtml.replace(/(?<=\<pre\s*[^\>]*?\>)[\s\S]*?(?=<\/pre>)/gi, '`#preContent#`');

  // 储存code的内容,并替换<code>中的内容
  codeContent = pureHtml.match(/(?<=\<code\s*[^\>]*?\>)[\s\S]*?(?=<\/code>)/gi);
  pureHtml = pureHtml.replace(/(?<=\<code\s*[^\>]*?\>)[\s\S]*?(?=<\/code>)/gi, '`#codeContent#`');

  // 储存a的内容,并替换<a>中的内容
  aContent = pureHtml.match(/<a\s*[^\>]*?\>[^]*?<\/a>/gi);
  pureHtml = pureHtml.replace(/<a\s*[^\>]*?\>[^]*?<\/a>/gi, '`#aContent#`');

  // 储存img的内容,并替换<img>中的内容
  imgContent = pureHtml.match(/<img\s*[^\>]*?\>[^]*?(<\/img>)?/gi);
  pureHtml = pureHtml.replace(/<img\s*[^\>]*?\>[^]*?(<\/img>)?/gi, '`#imgContent#`');

  // 获取纯净（无属性）的 html
  pureHtml = pureHtml.replace(/(?<=\<[a-zA-Z0-9]*)\s.*?(?=\>)/g, '');

  // 标题：标获取<h1><h2>...数据,并替换
  pureHtml = pureHtml
    .replace(/<h1>/gi, '[~wrap]# ')
    .replace(/<\/h1>/gi, '[~wrap][~wrap]')
    .replace(/<h2>/gi, '[~wrap]## ')
    .replace(/<\/h2>/gi, '[~wrap][~wrap]')
    .replace(/<h3>/gi, '[~wrap]### ')
    .replace(/<\/h3>/gi, '[~wrap][~wrap]')
    .replace(/<h4>/gi, '[~wrap]#### ')
    .replace(/<\/h4>/gi, '[~wrap][~wrap]')
    .replace(/<h5>/gi, '[~wrap]##### ')
    .replace(/<\/h5>/gi, '[~wrap][~wrap]')
    .replace(/<h6>/gi, '[~wrap]###### ')
    .replace(/<\/h6>/gi, '[~wrap][~wrap]');

  // 段落：处理一些常用的结构标签
  pureHtml = pureHtml
    .replace(/(<br>)/gi, '[~wrap]')
    .replace(/(<\/p>)|(<br\/>)|(<\/div>)/gi, '[~wrap][~wrap]')
    .replace(/(<meta>)|(<span>)|(<p>)|(<div>)/gi, '')
    .replace(/<\/span>/gi, '');

  // 粗体：替换<b><strong>
  pureHtml = pureHtml.replace(/(<b>)|(<strong>)/gi, '**').replace(/(<\/b>)|(<\/strong>)/gi, '**');

  // 斜体：替换<i><em><abbr><dfn><cite><address>
  pureHtml = pureHtml
    .replace(/(<i>)|(<em>)|(<abbr>)|(<dfn>)|(<cite>)|(<address>)/gi, '*')
    .replace(/(<\/i>)|(<\/em>)|(<\/abbr>)|(<\/dfn>)|(<\/cite>)|(<\/address>)/gi, '*');

  // 删除线：替换<del>
  pureHtml = pureHtml.replace(/\<del\>/gi, '~~').replace(/\<\/del\>/gi, '~~');

  // 引用：替换<blockquote>
  pureHtml = pureHtml.replace(/\<blockquote\>/gi, '[~wrap][~wrap]> ').replace(/\<\/blockquote\>/gi, '[~wrap][~wrap]');

  // 水平线：替换<hr>
  pureHtml = pureHtml.replace(/\<hr\>/gi, '[~wrap][~wrap]------[~wrap][~wrap]');

  // 表格 <table>,得到数据,删除标签，然后逐层分析储存,最终根据结果生成
  tableContent = pureHtml.match(/(?<=\<table\s*[^\>]*?\>)[\s\S]*?(?=<\/table>)/gi);
  pureHtml = pureHtml.replace(/<table\s*[^\>]*?\>[^]*?<\/table>/gi, '`#tableContent#`');
  if (tableContent !== null) {
    // 分析储存
    var tbodyContent = new Array();
    for (let i = 0; i < tableContent.length; i++) {
      tbodyContent[i] = new Array(); // tbodyContent[i]的第一个数据是thead数据,第二个是tbody的数据
      var trContent = new Array();
      trContent = tableContent[i].match(/(?<=\<tr\s*[^\>]*?\>)[\s\S]*?(?=<\/tr>)/gi);
      for (let j = 0; j < trContent.length; j++) {
        //tbodyContent[i][j] = new Array(); // tbodyContent[i][j]的第一个数据是th数据,第二个是td的数据
        //tbodyContent[i][j].push(tableContent[i].match(/(?<=\<th>)[\s\S]*?(?=<\/th?>)/gi));
        tbodyContent[i].push(trContent[j].match(/(?<=\<td>)[\s\S]*?(?=<\/td?>)/gi));
      }
    }
  }
  if (typeof tbodyContent !== 'undefined') {
    // 替换
    for (let i = 0; i < tbodyContent.length; i++) {
      let tableText = tableRecover(tbodyContent[i]);
      pureHtml = pureHtml.replace(/\`\#tableContent\#\`/i, tableText);
    }
  }

  // 有序列表<ol>的<li>,储存ol的内容,并循环恢复ol中的内容
  olContent = pureHtml.match(/(?<=\<ol\s*[^\>]*?\>)[\s\S]*?(?=<\/ol>)/gi);
  pureHtml = pureHtml.replace(/(?<=\<ol\s*[^\>]*?\>)[\s\S]*?(?=<\/ol>)/gi, '`#olContent#`');
  if (olContent !== null) {
    for (let k = 0; k < olContent.length; k++) {
      let olText = olRecover(olContent[k]);
      pureHtml = pureHtml.replace(/\`\#olContent\#\`/i, clearHtmlTag(olText));
    }
  }

  // 无序列表<ul>的<li>，以及<dd>,直接替换
  pureHtml = pureHtml.replace(/(<li>)|(<dd>)/gi, '[~wrap] - ').replace(/(<\/li>)|(<\/dd>)/gi, '[~wrap][~wrap]');

  // 处理完列表后，将 <lu>、<\lu>、<ol>、<\ol> 处理
  pureHtml = pureHtml.replace(/(<ul>)|(<ol>)/gi, '').replace(/(<\/ul>)|(<\/ol>)/gi, '[~wrap][~wrap]');

  // 先恢复 img ,再恢复 a
  if (imgContent !== null) {
    for (let i = 0; i < imgContent.length; i++) {
      let imgText = imgRecover(imgContent[i]);
      pureHtml = pureHtml.replace(/\`\#imgContent\#\`/i, imgText);
    }
  }

  // 恢复 a
  if (aContent !== null) {
    for (let k = 0; k < aContent.length; k++) {
      let aText = aRecover(aContent[k]);
      pureHtml = pureHtml.replace(/\`\#aContent\#\`/i, aText);
    }
  }

  // 换行处理，1.替换 [~wrap] 为 ‘\n’   2.首行换行删去。   3.将其他过长的换行删去。
  pureHtml = pureHtml.replace(/\[\~wrap\]/gi, '\n').replace(/\n{3,}/g, '\n\n');

  // 代码 <code> ,根据上面的数组恢复code,然后将code替换
  if (codeContent !== null) {
    for (let i = 0; i < codeContent.length; i++) {
      //console.log(codeContent[i]);
      pureHtml = pureHtml.replace(/\`\#codeContent\#\`/i, clearHtmlTag(codeContent[i].replace(/(<br>)/gi, '\n')));
    }
  }
  pureHtml = pureHtml.replace(/\<code\>/gi, ' ` ').replace(/\<\/code\>/gi, ' ` ');

  // 代码 <pre> ,恢复pre,然后将pre替换
  if (preContent !== null) {
    for (let k = 0; k < preContent.length; k++) {
      let preLanguage = preContent[k].match(/(?<=language-).*?(?=[\s'"])/i);
      preContent[k] = preContent[k].replace(/<br>/gi, '\n');
      console.log('preContent', preContent[k]);
      let preText = clearHtmlTag(preContent[k]);
      console.log('preText', preText);
      //preText = preText.replace(/^1\n2\n(\d+\n)*/, ''); // 去掉行数

      preLanguage = preLanguage != null && preLanguage[0] != 'undefined' ? preLanguage[0] + '\n' : '\n';
      pureHtml = pureHtml.replace(/\`\#preContent\#\`/i, preLanguage + preText);
    }
  }
  pureHtml = pureHtml.replace(/\<pre\>/gi, '```').replace(/\<\/pre\>/gi, '\n```\n');

  // 删去其余的html标签，还原预文本代码中的 '<' 和 '>'
  pureHtml = clearHtmlTag(pureHtml);
  pureHtml = pureHtml.replace(/\&lt\;/gi, '<').replace(/\&gt\;/gi, '>');

  console.log(pureHtml);

  // 删去头部的空行
  pureHtml = pureHtml.replace(/^\n{1,}/i, '');

  return pureHtml;
}
