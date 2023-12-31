import Konva from "konva";

fetch("/src/output.json")
  .then((res) => res.json())
  .then((data) => {
    groupedMatrixChart({ container: "app", width: 500, height: 400, data: data });
  });

function groupedMatrixChart({
  container,
  width,
  height,
  data,
}: {
  container: string;
  width: number;
  height: number;
  data: any;
}) {
  // 初始化舞台
  const stage = new Konva.Stage({
    container,
    width,
    height,
  });
  // 翻转坐标系
  // 将舞台的y属性设置为舞台高度的值
  stage.y(stage.height());
  // 将舞台的scaleY属性设置为-1，以将y轴正方向朝上
  stage.scaleY(-1);

  const layer = new Konva.Layer();
  stage.add(layer);

  // 给边缘留一点空间用于文字标签
  const GAP_50 = 50;
  const GAP_40 = 40;
  let contentGroup = new Konva.Group({
    x: GAP_50,
    y: GAP_50,
    width: layer.width() - GAP_50 * 2,
    height: layer.height() - GAP_50 * 2,
  });
  layer.add(contentGroup);

  let bak = new Konva.Rect({
    width: contentGroup.width(),
    height: contentGroup.height(),
    fill: "gray",
  });

  let circle1 = new Konva.Circle({
    radius: 10,
    x: contentGroup.width(),
    y: contentGroup.height(),
    fill: "red",
  });
  let circle2 = new Konva.Circle({
    radius: 10,
    x: 0,
    y: 0,
    fill: "red",
  });

  contentGroup.add(bak);
  contentGroup.add(circle1);
  contentGroup.add(circle2);

  // content area
  // 计算data的y轴范围
  let range = [data[0].x, data[0].x, data[0].y, data[0].y];
  for (const item of data) {
    if (item.x > range[1]) {
      range[1] = item.x;
    }
    if (item.y > range[3]) {
      range[3] = item.y;
    }
    if (item.x < range[0]) {
      range[0] = item.x;
    }
    if (item.y < range[2]) {
      range[2] = item.y;
    }
  }
  const xRange = range[1] - range[0],
    yRange = range[3] - range[2];

  // 数据 映射 图
  for (const pot of data) {
    let x = ((pot.x - range[0]) / xRange) * contentGroup.width();
    let y = ((pot.y - range[2]) / yRange) * contentGroup.height();
    let circle = new Konva.Circle({
      radius: 2,
      x: x,
      y: y,
      fill: Konva.Util.getRandomColor(),
    });
    contentGroup.add(circle);
  }

  // plot area
  const plotGroup = new Konva.Group({
    x: GAP_40,
    y: GAP_40,
    width: width - GAP_40 * 2,
    height: height - GAP_40 * 2,
  });
  layer.add(plotGroup);

  // 绘制坐标轴
  const xAxis = new Konva.Line({
    points: [0, 0, plotGroup.width(), 0],
    stroke: "black",
    strokeWidth: 1,
  });
  plotGroup.add(xAxis);

  const yAxis = new Konva.Line({
    points: [0, 0, 0, plotGroup.height()],
    stroke: "gray",
    strokeWidth: 1,
  });
  plotGroup.add(yAxis);
}
