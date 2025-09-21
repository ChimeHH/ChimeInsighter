import copy
import pathlib
from pprint import pprint

from reportlab.pdfbase import pdfmetrics   
from reportlab.pdfbase.ttfonts import TTFont 
from reportlab.platypus import Table, SimpleDocTemplate, PageTemplate, Paragraph, Image, Spacer, PageBreak, LongTable, PageBreak
from reportlab.platypus.frames import Frame
from reportlab.lib import pagesizes
from reportlab.lib.styles import getSampleStyleSheet  
from reportlab.lib import colors  
from reportlab.graphics.charts.barcharts import VerticalBarChart  
from reportlab.graphics.charts.legends import Legend  
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.shapes import Drawing, String, Line
from reportlab.lib.units import cm, inch  
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.sequencer import setSequencer, Sequencer
from reportlab.lib.validators import Auto
from reportlab.lib.colors import black 
from itertools import cycle

import functools

from exlib.classes.base import BaseClass
from exlib.settings import osenv

from exlib.log.logger import MyLogger
log = MyLogger.getLogger(__package__)

class SimpleStyleSheet(BaseClass):
    def __init__(self):       
        super().__init__()

        stylesheet = getSampleStyleSheet()   # 获取样式集
 
        # 获取reportlab自带样式
        self.Normal = stylesheet['Normal']
        self.BodyText = stylesheet['BodyText']
        self.Italic = stylesheet['Italic']
        self.Title = stylesheet['Title']

        self.Heading1 = stylesheet['Heading1']
        self.Heading2 = stylesheet['Heading2']
        self.Heading3 = stylesheet['Heading3']
        self.Heading4 = stylesheet['Heading4']
        self.Heading5 = stylesheet['Heading5']
        self.Heading6 = stylesheet['Heading6']

        self.Bullet = stylesheet['Bullet']
        self.Definition = stylesheet['Definition']
        self.Code = stylesheet['Code']
         
        # 自带样式不支持中文，需要设置中文字体，但有些样式会丢失，如斜体Italic。有待后续发现完全兼容的中文字体
        self.Normal.fontName = 'SimSun'
        self.BodyText.fontName = 'SimSun'
        self.Italic.fontName = 'SimSun'
        self.Title.fontName = 'SimSunBd'

        self.Heading1.fontName = 'SimSun'
        self.Heading2.fontName = 'SimSun'
        self.Heading3.fontName = 'SimSun'
        self.Heading4.fontName = 'SimSun'
        self.Heading5.fontName = 'SimSun'
        self.Heading6.fontName = 'SimSun'
        
        self.Bullet.fontName = 'SimSun'
        self.Definition.fontName = 'SimSun'
        self.Code.fontName = 'SimSun'
         
         
        # 添加自定义样式
        stylesheet.add(
            ParagraphStyle(name='body',
                           fontName="SimSun",
                           fontSize=10,
                           textColor='black',
                           leading=20,                # 行间距
                           spaceBefore=0,             # 段前间距
                           spaceAfter=10,             # 段后间距
                           leftIndent=0,              # 左缩进
                           rightIndent=0,             # 右缩进
                           firstLineIndent=20,        # 首行缩进，每个汉字为10
                           alignment=TA_JUSTIFY,      # 对齐方式
                           wordWrap='CJK',
         
                           # bulletFontSize=15,       #bullet为项目符号相关的设置
                           # bulletIndent=-50,
                           # bulletAnchor='start',
                           # bulletFontName='Symbol'
                           )
                    )

        self.body = stylesheet['body']
        self._stylesheet = stylesheet

        setSequencer(Sequencer())

class PdfExporter(BaseClass):
    def __init__(self):        
        super().__init__()

        self.stylesheet = SimpleStyleSheet()

        pdfmetrics.registerFont(TTFont('SimSun', str(osenv.appdata_path() / 'report' / 'SimSun.ttf')))
        pdfmetrics.registerFont(TTFont('SimSunBd', str(osenv.appdata_path() / 'report' / 'SimSun-Bold.ttf')))

        self.content = list()

    @classmethod
    def truncate_text(cls, text, maxlen, suffix=None):
        ommitted = len(text) - maxlen
        if maxlen> 0 and ommitted > 0:  
            if not suffix:
                suffix = f"(omitted {ommitted}...)"
            return text[:maxlen] + suffix  
        return text

    @classmethod
    def truncate_data(cls, data, maxlen, suffix=None):  
        processed_data = []  

        for row in data:
            processed_row = []
            for cell in row:  
                if isinstance(cell, str):
                    cell = cls.truncate_text(cell, maxlen, suffix=suffix)
                processed_row.append(cell)
            processed_data.append(processed_row)  
        return processed_data  

    def append(self, element):
        self.content.append(element)
    
    @classmethod
    def draw_title(cls, title: str):
        
        style = getSampleStyleSheet()
        
        ct = style['Heading1']
        
        ct.fontName = 'SimSun'      
        ct.fontSize = 18            
        ct.leading = 50             
        ct.textColor = colors.green     
        ct.alignment = 1    
        ct.bold = True
        
        return Paragraph(title, ct)
      
  
    @classmethod
    def draw_little_title(cls, title: str):
        
        style = getSampleStyleSheet()
        
        ct = style['Normal']
        
        ct.fontName = 'SimSun'  
        ct.fontSize = 15  
        ct.leading = 30  
        ct.textColor = colors.red  
        
        return Paragraph(title, ct)

    @classmethod
    def draw_cell(cls, text, fontName='SimSun', fontSize=9, wordWrap='CJK', alignment=0, firstLineIndent=0, leading=10, maxlen=512):
        return cls.draw_text(text, fontName=fontName, fontSize=fontSize, wordWrap=wordWrap, alignment=alignment, firstLineIndent=firstLineIndent, leading=leading, maxlen=maxlen)

    @classmethod
    def draw_text(cls, text, fontName='SimSun', fontSize=12, wordWrap='CJK', alignment=0, firstLineIndent=32, leading=25, maxlen=0):
        
        style = getSampleStyleSheet()
        
        ct = style['Normal']
        ct.fontName = fontName
        ct.fontSize = fontSize
        ct.wordWrap = wordWrap     
        ct.alignment = alignment        
        ct.firstLineIndent = firstLineIndent     
        ct.leading = leading

        if maxlen>0:
            text = text[:maxlen]

        return Paragraph(text, ct)

    @classmethod
    def draw_emptyline(cls):
        return Paragraph("\xa0")

    @classmethod
    def draw_spacer(cls, height=10):
        return Spacer(1, height)

    @classmethod
    def draw_pagebreak(cls):
        return PageBreak()

    @classmethod
    def subset(cls, data, from_index=0, maxrows=32):
        maxrows = maxrows if maxrows else 32
        return data[from_index: maxrows]
        
    @classmethod
    def draw_table(cls, *data, col_width=120, style=None, hAlign='LEFT'):
        if not style:
            style = [
                ('FONTNAME', (0, 0), (-1, -1), 'SimSun'),  
                ('FONTSIZE', (0, 0), (-1, 0), 12),  
                ('FONTSIZE', (0, 1), (-1, -1), 10),  
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  
                ('ALIGN', (0, 1), (-1, -1), 'LEFT'),  
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),  
                ('BACKGROUND', (0, 0), (-1, 0), '#d5dae6'),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.darkslategray),  
                ('GRID', (0, 0), (-1, -1), 0.1, colors.grey),                
            ]
  
        data = cls.truncate_data(data, 256)        
        table = Table(data, colWidths=col_width, style=style, hAlign=hAlign, splitByRow=True, )
        return table

    @classmethod
    def draw_pie(cls, data: list, labels: list, use_colors=[], x=45, y=45, width=400, height=300):    
        drawing = Drawing(width, height) # 指定画布的宽高，图表图例都画在画布上

        labels = cls._round_labels(labels)
        pc = Pie()
        pc.width                  = width / 2 # 指定图表的宽高        
        pc.height                 = pc.width
        
        pc.x                      = 80 # 图表左下角的坐标
        pc.y                      = 50 # (height-pc.height)/2 - 10

        pc.data = data # 图表表现的数据
        pc.labels = [f"{label}: {value}" for label, value in zip(labels, data)]

        pc.sideLabels = 1
        pc.checkLabelOverlap = 1
        pc.simpleLabels = 0

        pc.slices.label_visible   = 1 # 图标上是否写字段名        
        pc.slices.strokeColor     = colors.white # 图表上线的颜色和宽度
        pc.slices.strokeWidth     = 1
        pc.slices.fontSize        = 5 # 图表上标签的字体大小
        
        drawing.add(pc)   # 将图表添加进画布

        
    
        # 在方法的开头
        if not use_colors:
            use_colors = [
                            colors.red,
                            colors.green,
                            colors.blue,
                            colors.orange,
                            colors.purple,
                            colors.yellow,
                            colors.cyan,
                            colors.magenta,
                            colors.brown,
                            colors.darkgreen,
                            colors.darkblue,
                            colors.darkred,
                            colors.darkorange,
                            colors.darkviolet,
                            colors.lightblue,
                            colors.lightgreen,
                            colors.gold,
                            colors.silver,
                            colors.indigo,
                            colors.turquoise,
                            colors.teal,
                            colors.coral,
                            colors.salmon,
                            colors.tomato,
                            colors.plum,
                            colors.sandybrown,
                            colors.khaki,
                            colors.mediumslateblue,
                            colors.lightcoral,
                            colors.mediumseagreen,
                            colors.royalblue,
                            colors.forestgreen,
                            colors.dimgray
                        ]

        # 使用 cycle 循环颜色
        color_cycle = cycle(use_colors)

        for i in range(len(data)):
            if i < len(pc.slices):
                # 如果提供的颜色比数据多，直接使用
                pc.slices[i].fillColor = use_colors[i % len(use_colors)]
            else:
                # 循环使用颜色
                pc.slices[i].fillColor = next(color_cycle)            

        return drawing
    
    @classmethod
    def _round_value_step(cls, valueMax):
        if not valueMax:
            return None

        step = valueMax / 10
        steps = [10, 20, 50, 100, 200, 500, 1000, 10000, 100000]
        for r in steps:
            if step < r:
                return r
        return None

    @classmethod
    def _round_labels(cls, labels, maxlen=16):
        return [ label[:maxlen] for label in labels ]

    @classmethod
    def _round_category_names(cls, names, maxlen=12):
        return [ name[:maxlen] for name in names ]

    @classmethod
    def draw_bar(cls, bar_data: list, ax: list, labels: list, use_colors=[],   
                 x=45, y=45, width=500, height=300,  
                 valueMin=0, valueMax=None, valueStep=None, style=None):  
        
        drawing = Drawing(width, height)  
        ax = cls._round_category_names(ax)  
        bc = VerticalBarChart()  
        bc.x = x       
        bc.y = y      
        bc.width = width / 2   
        bc.height = bc.width   
       
        # 设置Y轴的最小、最大和步进值  
        bc.valueAxis.valueMin = valueMin  
        bc.valueAxis.valueMax = valueMax if valueMax is not None else cls._round_value_step(bar_data)  
        bc.valueAxis.valueStep = valueStep if valueStep is not None else cls._round_value_step(valueMax)  

        # 设置类别轴  
        if style:  
            bc.categoryAxis.style = style  
        bc.categoryAxis.labels.dx = 2  
        bc.categoryAxis.labels.dy = -8  
        bc.categoryAxis.labels.angle = 20  

        bc.data = bar_data
        bc.categoryAxis.categoryNames = ax  
        bc.barLabelFormat = '%d'
        bc.barLabels.fontSize = 6
        
        # 设置柱子的颜色  
        if use_colors:  
            for i, co in enumerate(use_colors):  
                if i < len(bc.bars):  
                    bc.bars[i].fillColor = co  
                
        labels = cls._round_labels(labels)  
        leg = Legend()  
        leg.fontName = 'SimSun'  
        leg.alignment = 'right'  
        leg.boxAnchor = 'ne'  
        leg.x = bc.width + 130         
        leg.y = bc.height  
        leg.dxTextSpace = 10  
        leg.columnMaximum = 24  
        
        if use_colors:  
            leg.colorNamePairs = list(zip(use_colors, labels))  
        else:  
            leg.colorNamePairs = [labels]  
        
        drawing.add(leg)  # 添加图例  
        drawing.add(bc)   # 添加柱状图  
            
        return drawing  
    
    @classmethod
    def draw_lineplot(cls, data: list, ax: list, labels: list, use_colors=[], x=45, y=45, width=500, height=300, valueMin=0, valueMax=None, valueStep=None):
        drawing = Drawing(width, height)

        ax = cls._round_category_names(ax)
        lc = HorizontalLineChart()
        lc.x = x
        lc.y = y
        lc.width = width / 2 
        lc.height = lc.width
        lc.data = data
        lc.joinedLines = 1
        lc.categoryAxis.categoryNames = ax
        lc.categoryAxis.labels.boxAnchor = 'n'
        lc.valueAxis.valueMin = valueMin        
        # lc.strokeColor = colors.black # 边框
        lc.lineLabelArray = labels
        if valueMax != None:
            lc.valueAxis.valueMax = valueMax
        if valueStep != None:
            lc.valueAxis.valueStep = valueStep
        else:
            lc.valueAxis.valueStep = cls._round_value_step(valueMax)

        if use_colors:
            for i, co in enumerate(use_colors):
                lc.lines[i].strokeColor = co
        
        labels = cls._round_labels(labels)
        leg = Legend()
        leg.fontName = 'SimSun'
        leg.alignment = 'right'
        leg.boxAnchor = 'ne'
        leg.x = lc.width + 130         
        leg.y = lc.height
        leg.dxTextSpace = 10
        leg.columnMaximum = 24
        if use_colors:
            leg.colorNamePairs = list(zip(use_colors, labels))
        # else:
        #     leg.colorNamePairs = [(lc.lines[i].strokeColor, labels[i] ) for i in range(len(lc.data))]

        drawing.add(lc)
        drawing.add(leg)

        return drawing

    
    @classmethod
    def draw_img(cls, path, width=18, height=8):
        img = Image(path)       
        img.drawWidth = width*cm
        img.drawHeight = height*cm       
        return img

    @classmethod
    def draw_paragraph(cls, text, style, maxlen=0):
        if maxlen>0:
            text = text[:maxlen]

        pg = Paragraph(text, style)
        return pg

    def build(self, filepath, pagesize=pagesizes.letter, header="", footer=""):
        doc = SimpleDocTemplate(str(filepath), pagesize=pagesize,
                        leftMargin = 2.2 * cm, 
                        rightMargin = 2.2 * cm,
                        topMargin = 1.5 * cm, 
                        bottomMargin = 2.5 * cm)

        frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='normal')

        header_content = Paragraph(header, self.stylesheet.Normal)
        footer_content = Paragraph(footer, self.stylesheet.Normal)

        template = PageTemplate(id='test', frames=frame, onPage=functools.partial(self._header_and_footer, header_content=header_content, footer_content=footer_content))

        doc.addPageTemplates([template])

        doc.build(self.content)

    @classmethod
    def _header(cls, canvas, doc, content):
        canvas.saveState()
        w, h = content.wrap(doc.width, doc.topMargin)
        content.drawOn(canvas, doc.leftMargin, doc.height + doc.bottomMargin + doc.topMargin - h)
        canvas.restoreState()

    @classmethod
    def _footer(cls, canvas, doc, content):
        canvas.saveState()
        w, h = content.wrap(doc.width, doc.bottomMargin)
        content.drawOn(canvas, doc.leftMargin, h)
        canvas.restoreState()

    @classmethod
    def _header_and_footer(cls, canvas, doc, header_content, footer_content):
        cls._header(canvas, doc, header_content)
        cls._footer(canvas, doc, footer_content)

    @classmethod
    def _great_poem(cls):
        return "才饮长沙水，又食武昌鱼。万里长江横渡，极目楚天舒。不管风吹浪打，胜似闲庭信步，今日得宽馀。子在川上曰：逝者如斯夫！", "-- 水调歌头·游泳, 毛泽东"


if __name__ == '__main__':
    exporter = PdfExporter()
    
    exporter.append(exporter.draw_img(str(osenv.appdata_path() / 'report' / 'system_info.png'), width=14, height=2))

    exporter.append(exporter.draw_text(exporter._great_poem()[0], alignment=0, firstLineIndent=0))
    exporter.append(exporter.draw_text(exporter._great_poem()[1], alignment=2))

    exporter.append(exporter.draw_title('数据分析就业薪资'))
    exporter.append(exporter.draw_text('众所周知，大数据分析师岗位是香饽饽，近几年数据分析热席卷了整个互联网行业，与数据分析的相关的岗位招聘、培训数不胜数。很多人前赴后继，想要参与到这波红利当中。那么数据分析师就业前景到底怎么样呢？'))
    
    exporter.append(exporter.draw_little_title('不同级别的平均薪资'))
    
    data = [
        ('职位名称', '平均薪资(K)', '较上年增长率'),
        ('数据分析师', 18.5, '25%'),
        ('高级数据分析师', 25.5, '14%'),
        ('资深数据分析师', 29.3, '10%')
    ]
    exporter.append(exporter.draw_table(*data, col_width=[80, 120, 120]))

    
    content1 = "<para><u color='red'><font fontSize=13>区块链</font></u>是分布式数据存储、<strike color='red'>点对点传输</strike>、共识机制、" \
          "<font color='red' fontSize=13>加密算法</font>等计算机技术的<font name='SimSunBd'>新型应用模式</font>。<br/>" \
          "&nbsp&nbsp<a href='www.baidu.com' color='blue'>区块链（Blockchain）</a>，" \
          "是比特币的一个重要概念，它本质上是一个去中心化的数据库，同时作为比特币的底层技术，是一串使用密码学方法相关联产生的" \
          "数据块，每一个数据块中包含了一批次比特币网络交易的信息，用于验证其信息的有效性（防伪）和生成下一个区块 [1]。</para>"
 
    content2 = "区块链起源于比特币，2008年11月1日，一位自称中本聪(SatoshiNakamoto)的人发表了《比特币:一种点对点的电子现金系统》" \
           "一文 [2]  ，阐述了基于P2P网络技术、加密技术、时间戳技术、区块链技术等的电子现金系统的构架理念，这标志着比特币的诞生" \
           "。两个月后理论步入实践，2009年1月3日第一个序号为0的创世区块诞生。几天后2009年1月9日出现序号为1的区块，并与序号为" \
           "0的创世区块相连接形成了链，标志着区块链的诞生 [5]  。<br/><img src='/share/temp/1.jpg' width=180 height=100 valign='top'/><br/><br/><br/><br/><br/>"

    exporter.append(exporter.draw_paragraph("区块链", exporter.stylesheet.Title))
    exporter.append(exporter.draw_paragraph("<seq id='spam'/>.区块链概念", exporter.stylesheet.Heading2))
    exporter.append(exporter.draw_paragraph(content1, exporter.stylesheet.body))
    exporter.append(exporter.draw_paragraph("<seq id='spam'/>.区块链起源", exporter.stylesheet.Heading2))
    exporter.append(exporter.draw_paragraph(content2, exporter.stylesheet.body))

    
    exporter.append(exporter.draw_little_title('热门城市的就业情况'))
    b_data = [(25400, 12900, 20100, 20300, 20300, 17400), (15800, 9700, 12982, 9928, 13900, 9763)]
    ax_data = ['BeiJing', 'ChengDu', 'ShenZhen', 'ShangHai', 'HangZhou', 'NanJing']
    use_colors = [colors.red, colors.blue]
    leg_labels = ['平均薪资', '招聘量']
    exporter.append(exporter.draw_bar(b_data, ax_data, leg_labels, use_colors=use_colors))

    exporter.append(exporter.draw_line(b_data, ax_data, leg_labels, use_colors=use_colors, valueMin=0, valueMax=30000, valueStep=5000))

    exporter.append(exporter.draw_little_title('饼图'))
    dataList = [10, 20, 30, 40, 50, 60, 70]
    labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    exporter.append(exporter.draw_pie(dataList, labels))

    filepath = pathlib.Path("/share/temp/sample_report.pdf")
    exporter.build(filepath, header="极目数字孪生合规与安全检测")