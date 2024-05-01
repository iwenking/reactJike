import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";
import {
  createArticleAPI,
  getArticleDetailAPI,
  updateArticleAPI,
} from "@/apis/article";
import { useState, useEffect } from "react";
import { message } from "antd";
import { useChannel } from "@/hooks/useChannel";
import { useSearchParams } from "react-router-dom";

const { Option } = Select;

const Publish = () => {
  //频道列表
  const { channelList } = useChannel();

  //提交表单
  const onFinish = async (values) => {
    //校验封面类型imagesType是否和实际的图片列表imageList长度一致
    if (imageList.length !== imageType)
      return message.warning("封面类型和图片数量不匹配");

    const { title, content, channel_id } = values;
    const resData = {
      title,
      content,
      cover: {
        type: imageType, //封面模式
        //这里的url处理逻辑只是在新增的时候的逻辑
        //编辑的时候也需要做处理
        images: imageList.map((item) => {
          if (item.respone) {
            return item.respone.data.url;
          } else {
            return item.url;
          }
        }), //封面列表
      },
      channel_id,
    };
    //调用不同的接口
    if (articleId) {
      //更新接口
      await updateArticleAPI({ ...resData, id: articleId });
    } else {
      await createArticleAPI(resData);
    }
  };
  //上传回调
  const [imageList, setImagesList] = useState([]);
  const onChange = (flies) => {
    setImagesList(flies.fileList);
  };
  //切换图片类型
  const [imageType, setImageType] = useState(0);
  const onTypeChange = (e) => {
    setImageType(e.target.value);
  };
  //回填数据
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id");
  //获取实例
  const [form] = Form.useForm();
  console.log(articleId);
  useEffect(() => {
    async function getArticleDetail() {
      const res = await getArticleDetailAPI(articleId);
      const data = res.data;
      const { cover } = data;
      form.setFieldsValue({
        ...data,
        type: cover.type,
      });
      setImageType(cover.type);
      setImagesList(
        cover.images.map((item) => ({
          url: item,
        }))
      );
    }
    if (articleId) {
      getArticleDetail();
    }
  }, [articleId, form]);

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: `${articleId ? "编辑" : "新增"}文章` },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: imageType }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                showUploadList
                action={"http://geek.itheima.net/v1_0/upload"}
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
