import { Button, Card, Col, Form, Input, Row, Select, Switch } from "antd";
import { useCategories, type Category } from "~/api/categories";
import { useAllTenants } from "~/api/tenants";
import type { ProductQueryParams } from "~/api/products";

type ProductFilterProps = {
  queryParams: ProductQueryParams;
  onFilterChange: (filterName: string, filterValue: string | boolean | undefined) => void;
  onClick: () => void;
  isAdmin: boolean;
};

function ProductFilter({ queryParams, onFilterChange, onClick, isAdmin }: ProductFilterProps) {
  const { categoriesData, isLoading: categoriesLoading } = useCategories();
  const { tenantsOptions, isLoading: tenantsLoading } = useAllTenants();

  const categoryOptions = categoriesData.map((cat: Category) => ({
    value: cat._id,
    label: cat.name,
  }));

  return (
    <Card>
      <Row justify="space-between">
        <Col span={18}>
          <Row gutter={16} align="middle">
            <Col span={7}>
              <Input.Search
                style={{ width: "100%" }}
                placeholder="Search products"
                value={queryParams.q}
                onChange={(e) => onFilterChange("q", e.target.value)}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Category"
                allowClear
                loading={categoriesLoading}
                options={categoryOptions}
                value={queryParams.categoryId}
                onChange={(value) => onFilterChange("categoryId", value)}
              />
            </Col>
            {isAdmin && (
              <Col span={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Restaurant (Tenant)"
                  allowClear
                  loading={tenantsLoading}
                  options={tenantsOptions.map((t) => ({ value: t.id, label: t.name }))}
                  value={queryParams.tenantId}
                  onChange={(value) => onFilterChange("tenantId", value)}
                />
              </Col>
            )}
            <Col>
              <Form.Item label="Published" style={{ margin: 0 }}>
                <Switch
                  checked={queryParams.isPublish ?? false}
                  onChange={(checked) =>
                    onFilterChange("isPublish", checked ? true : undefined)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={6} style={{ display: "flex", justifyContent: "end" }}>
          <Button type="primary" onClick={onClick}>
            + Add Product
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default ProductFilter;
