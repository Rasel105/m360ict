import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  Alert,
  InputNumber,
  DatePicker,
  Upload,
  Space,
} from "antd";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useGetCategoriesQuery,
} from "../api/productApi";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs"; // Ensure you have dayjs for date handling

const { Option } = Select;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(Number(id));
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();

  const onFinish = async (values: any) => {
    try {
      const cleanedValues = {
        ...values,
        reviews: values.reviews.filter(
          (review: any) => review.comment && review.rating
        ),
        meta: {
          ...values.meta,
          createdAt: values.meta.createdAt
            ? values.meta.createdAt.toISOString()
            : undefined,
          updatedAt: values.meta.updatedAt
            ? values.meta.updatedAt.toISOString()
            : undefined,
        },
      };

      await updateProduct({ id: Number(id), ...cleanedValues }).unwrap();
      console.log(cleanedValues);
    } catch (error) {
      console.error(error);
    }
  };

  if (productLoading || categoriesLoading) return <Spin tip="Loading..." />;
  if (productError || categoriesError)
    return (
      <Alert
        message="Error"
        description="Error loading data"
        type="error"
        showIcon
      />
    );

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Back Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button
          type="default"
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: "20px" }}
        >
          Back
        </Button>
      </div>

      <Form
        initialValues={{
          ...productData,
          reviews: productData?.reviews || [],
          meta: {
            createdAt: productData?.meta.createdAt
              ? dayjs(productData.meta.createdAt)
              : undefined,
            updatedAt: productData?.meta.updatedAt
              ? dayjs(productData.meta.updatedAt)
              : undefined,
          },
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        {/* Form Fields */}
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Price is required" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Select>
            {categories?.map((category: any) => (
              <Option key={category.slug} value={category.slug}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="discountPercentage" label="Discount Percentage">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="rating" label="Rating">
          <InputNumber min={0} max={5} step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="stock" label="Stock">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Input />
        </Form.Item>
        <Form.Item name="brand" label="Brand">
          <Input />
        </Form.Item>
        <Form.Item name="sku" label="SKU">
          <Input />
        </Form.Item>
        <Form.Item name="weight" label="Weight (kg)">
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="dimensions" label="Dimensions (W x H x D) in cm">
          <Space direction="vertical">
            <InputNumber placeholder="Width" style={{ width: "100%" }} />
            <InputNumber placeholder="Height" style={{ width: "100%" }} />
            <InputNumber placeholder="Depth" style={{ width: "100%" }} />
          </Space>
        </Form.Item>
        <Form.Item name="warrantyInformation" label="Warranty Information">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="shippingInformation" label="Shipping Information">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="availabilityStatus" label="Availability Status">
          <Input />
        </Form.Item>
        <Form.Item name="returnPolicy" label="Return Policy">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="minimumOrderQuantity" label="Minimum Order Quantity">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name={["meta", "createdAt"]} label="Created At">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name={["meta", "updatedAt"]} label="Updated At">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name={["meta", "barcode"]} label="Barcode">
          <Input />
        </Form.Item>
        <Form.Item name={["meta", "qrCode"]} label="QR Code">
          <Upload
            listType="picture"
            maxCount={1}
            showUploadList={{ showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="images" label="Images">
          <Upload
            listType="picture"
            multiple
            showUploadList={{ showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.List name="reviews">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ marginBottom: "20px" }}>
                  <Form.Item
                    {...restField}
                    name={[name, "comment"]}
                    rules={[
                      { required: true, message: "Review comment is required" },
                    ]}
                  >
                    <Input.TextArea placeholder="Review Comment" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "rating"]}
                    rules={[{ required: true, message: "Rating is required" }]}
                  >
                    <InputNumber
                      min={1}
                      max={5}
                      step={0.1}
                      style={{ width: "100%" }}
                      placeholder="Rating"
                    />
                  </Form.Item>
                  <Button
                    onClick={() => remove(name)}
                    type="dashed"
                    style={{ marginRight: "10px" }}
                  >
                    Remove Review
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()}>
                Add Review
              </Button>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductEdit;
