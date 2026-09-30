import { useEffect } from "react";
import { Alert, Button, Drawer, Form, Space } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import {
  type Coupon,
  type CouponPayload,
  useCreateCoupon,
  useUpdateCoupon,
} from "~/api/coupons";
import CouponForm from "./forms/CouponForm";

type CouponDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  editingCoupon?: Coupon | null;
};

const CouponDrawer = ({
  isOpen,
  onClose,
  isAdmin,
  editingCoupon,
}: CouponDrawerProps) => {
  const [form] = Form.useForm();
  const { createCoupon, isPending: isCreating, error: createError } =
    useCreateCoupon();
  const { updateCoupon, isPending: isUpdating, error: updateError } =
    useUpdateCoupon();

  const isEditing = Boolean(editingCoupon);
  const isPending = isCreating || isUpdating;
  const apiError = isEditing ? updateError : createError;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!editingCoupon) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      title: editingCoupon.title,
      code: editingCoupon.code,
      discount: editingCoupon.discount,
      validUpto: dayjs(editingCoupon.validUpto),
      tenantId: isAdmin ? String(editingCoupon.tenantId) : undefined,
    });
  }, [isOpen, editingCoupon, isAdmin, form]);

  const onHandleSubmit = async () => {
    const values = await form.validateFields();
    const validUpto: Dayjs = values.validUpto;

    const payload: CouponPayload = {
      title: values.title,
      code: values.code,
      discount: values.discount,
      validUpto: validUpto.toISOString(),
      ...(isAdmin && values.tenantId
        ? { tenantId: Number(values.tenantId) }
        : {}),
    };

    if (isEditing && editingCoupon) {
      updateCoupon({ _id: editingCoupon._id, ...payload });
    } else {
      createCoupon(payload);
    }
  };

  const onHandleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onHandleClose}
      size={600}
      title={isEditing ? "Edit coupon" : "New coupon"}
      extra={
        <Space>
          <Button onClick={onHandleClose} disabled={isPending}>
            Close
          </Button>
          <Button
            type="primary"
            onClick={onHandleSubmit}
            loading={isPending}
            disabled={isPending}
          >
            Submit
          </Button>
        </Space>
      }
      destroyOnHidden
    >
      {apiError ? (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message={apiError.message}
        />
      ) : null}

      <Form form={form} layout="vertical">
        <CouponForm isAdmin={isAdmin} />
      </Form>
    </Drawer>
  );
};

export default CouponDrawer;
