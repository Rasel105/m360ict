/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, Spin, Alert } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../api/productApi";
import "./ProductList.css";
import { ColumnsType } from "antd/es/table";

const { Title } = Typography;

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
};

const ProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fetchAll, setFetchAll] = useState(false);

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    limit: fetchAll ? 0 : pageSize,
    skip: fetchAll ? 0 : (currentPage - 1) * pageSize,
  });

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [fetchAll, currentPage, pageSize, refetch]);

  const handleShowAllClick = () => {
    setFetchAll((prevFetchAll) => !prevFetchAll);
    setCurrentPage(1);
  };

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin tip="Loading..." />
      </div>
    );

  if (error)
    return (
      <Alert
        message="Error"
        description="Error loading products"
        type="error"
        showIcon
      />
    );

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      align: "center",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "center",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_text: string, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/product/${record.id}`)}
          >
            Details
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/product/${record.id}/edit`)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  console.log("data?.products", data?.products);

  return (
    <div className="product-list-container">
      <Title
        level={2}
        className="title"
        style={{ textAlign: "center", marginTop: 0 }}
      >
        Product List
      </Title>
      <Button
        icon={<UnorderedListOutlined />}
        onClick={handleShowAllClick}
        style={{ marginBottom: 10 }}
      >
        {fetchAll ? "Show Paginated" : "Show All"}
      </Button>
      <Table
        dataSource={data?.products || []}
        columns={columns}
        pagination={
          fetchAll
            ? false
            : {
                current: currentPage,
                pageSize: pageSize,
                total: data?.total,
                onChange: handlePaginationChange,
              }
        }
        rowKey="id"
        className="product-table"
      />
    </div>
  );
};

export default ProductList;
