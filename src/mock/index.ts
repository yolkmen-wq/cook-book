import Mock from "mockjs";
const Random = Mock.Random;
export const listData = Mock.mock("/data/list", "get", {
  data: {
    // 属性 list 的值是一个数组，随机生成 1 到 10 个元素
    "list|10-15": [
      {
        name: Random.csentence(5, 15),
        content: Random.cparagraph(),
        cover: Random.image("200x100", "#16d46b", "#fff", "png", "Hello"),
        createTime:Random.datetime('yyyy-MM-dd'),
        viewNums: Random.integer(0, 1000),
        pId: 1,
      },
      {
        name: Random.csentence(5, 15),
        content: Random.cparagraph(),
        cover: Random.image("200x100", "#16d46b", "#fff", "png", "Hello"),
        createTime:Random.datetime('yyyy-MM-dd'),
        viewNums: Random.integer(0, 1000),
        pId: 2,
      },
      {
        name: Random.csentence(5, 15),
        content: Random.cparagraph(),
        cover: Random.image("200x100", "#16d46b", "#fff", "png", "Hello"),
        createTime:Random.datetime('yyyy-MM-dd'),
        viewNums: Random.integer(0, 1000),
        pId: 3,
      },
    ],
  },
  code: 200,
  message: "ok",
});

export const categoryData = Mock.mock("/data/category", "get", {
  data: {
    // 属性 list 的值是一个数组，随机生成 1 到 10 个元素
    "list|3-5": [
      {
        name: Random.csentence(1, 10),
        pId: 1,
      },
      {
        name: Random.csentence(1, 10),
        pId: 2,
      },
      {
        name: Random.csentence(1, 10),
        pId: 3,
      },
    ],
  },
  code: 200,
  message: "ok",
});

export const recommentData = Mock.mock("/data/recomment", "get", {
  data: {
    // 属性 list 的值是一个数组，随机生成 1 到 10 个元素
    "list|1-5": [
      {
        name: Random.csentence(5, 15),
        content: Random.cparagraph(),
        image: Random.image("200x100", "#16d46b", "#fff", "png", "Hello"),
        createTime:Random.datetime('yyyy-MM-dd'),
        viewNums: Random.integer(0, 1000),
        pId: 1,
      },
    ],
  },
  code: 200,
  message: "ok",
});

export const categoryData2 = Mock.mock("/data/category", "get", {
  data: {
    // 属性 list 的值是一个数组，随机生成 1 到 10 个元素
    "list|1-5": [
      {
        name: Random.csentence(5, 15),
        articleNum: Random.integer(0, 100),
        cover: Random.image("200x100", "#16d46b", "#fff", "png", "Category"),
        createTime:Random.datetime('yyyy-MM-dd'),
        pId: 1,
      },
    ],
  },
  code: 200,
  message: "ok",
});

export const lastestData = Mock.mock("/data/lastest", "get", {
  data: {
    // 属性 list 的值是一个数组，随机生成 1 到 10 个元素
    "list|1-5": [
      {
        title: Random.csentence(1, 10),
        desc: Random.cparagraph(10, 15),
        cover: Random.image("200x100", "#16d46b", "#fff", "png", "Article"),
        createTime:Random.datetime('yyyy-MM-dd'),
        viewsCount: Random.integer(0, 1000),
        pId: 1,
      },
    ],
  },
  code: 200,
  message: "ok",
});