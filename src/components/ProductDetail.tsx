import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../api/productApi';
import { Card, Descriptions, Divider, Image, Alert, Spin, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProductByIdQuery(Number(id));

  if (isLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="Loading..." />
      </div>
    );

  if (error)
    return (
      <Alert message="Error" description="Error loading product" type="error" showIcon />
    );

  return (
    <div style={{ padding: '20px', maxWidth: '2000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button type="default" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          Back
        </Button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Image src={data?.images[0]} alt={data?.title} style={{ maxHeight: '300px', maxWidth: '100%' }} />
      </div>
      <Card style={{ padding: '20px' }}>
        <Descriptions title="Product Details" bordered>
          <Descriptions.Item label="Title">{data?.title}</Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>{data?.description}</Descriptions.Item>
          <Descriptions.Item label="Price">${data?.price.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Category">{data?.category}</Descriptions.Item>
          <Descriptions.Item label="Brand">{data?.brand}</Descriptions.Item>
          <Descriptions.Item label="SKU">{data?.sku}</Descriptions.Item>
          <Descriptions.Item label="Stock">{data?.stock}</Descriptions.Item>
          <Descriptions.Item label="Rating">{data?.rating}</Descriptions.Item>
          <Descriptions.Item label="Weight">{data?.weight} kg</Descriptions.Item>
          <Descriptions.Item label="Dimensions">
            {data?.dimensions ? `W: ${data?.dimensions.width} cm, H: ${data?.dimensions.height} cm, D: ${data?.dimensions.depth} cm` : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Warranty Information">{data?.warrantyInformation}</Descriptions.Item>
          <Descriptions.Item label="Shipping Information">{data?.shippingInformation}</Descriptions.Item>
          <Descriptions.Item label="Availability Status">{data?.availabilityStatus}</Descriptions.Item>
          <Descriptions.Item label="Return Policy">{data?.returnPolicy}</Descriptions.Item>
          <Descriptions.Item label="Minimum Order Quantity">{data?.minimumOrderQuantity}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {data?.meta.createdAt ? new Date(data.meta.createdAt).toLocaleString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {data?.meta.updatedAt ? new Date(data.meta.updatedAt).toLocaleString() : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Barcode">{data?.meta.barcode}</Descriptions.Item>
          <Descriptions.Item label="QR Code">
            <Image src={data?.meta.qrCode} alt="QR Code" style={{ maxWidth: '100px' }} />
          </Descriptions.Item>
        </Descriptions>

        <Divider>Reviews</Divider>
        {data?.reviews.map((review, index) => (
          <Card key={index} type="inner" title={review.reviewerName} extra={`Rating: ${review.rating}/5`} style={{ marginBottom: '10px' }}>
            <p>{review.comment}</p>
            <p><small>{new Date(review.date).toLocaleString()}</small></p>
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default ProductDetail;
