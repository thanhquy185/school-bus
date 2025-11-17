import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ruleRequired } from "../../common/rules";
import useCallApi from "../../api/useCall";
import { login } from "../../services/auth-service";
import { useAuth } from "../../contexts/authContext";

// Trang đăng nhập
const LoginPage = () => {
  const [form] = useForm();
  const { execute, notify } = useCallApi();

  const auth = useAuth();

  const handleLogin = async () => {
    const restResponse = await execute(login(form.getFieldValue("username"), form.getFieldValue("password")));
    notify(restResponse, "Đăng nhập thành công");
    if (restResponse?.result) {
      auth.setAuth(restResponse.data);
      window.location.href = `/${(restResponse.data.role as string).toLowerCase()}`
    }
  }

  return (
    <>
      <div className="login">
        <div className="login__brand">
          <span className="login__brand-light">
            <span></span>
          </span>
          <div className="login__brand-info">
            <img src="/src/assets/images/others/logo-image.png" alt="logo" />
            <h1>School Bus</h1>
          </div>
          <span className="login__brand-light">
            <span></span>
          </span>
        </div>
        <div className="login__form">
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="username"
              htmlFor="username"
              label="Tên tài khoản"
              rules={[ruleRequired("Tên tài khoản không được để trống !")]}
            >
              <Input
                id="username"
                prefix={<UserOutlined />}
                placeholder="Nhập Tên tài khoản"
              />
            </Form.Item>
            <Form.Item
              name="password"
              htmlFor="password"
              label="Mật khẩu"
              rules={[ruleRequired("Mật khẩu không được để trống !")]}
            >
              <Input.Password
                id="password"
                prefix={<LockOutlined />}
                placeholder="Nhập Mật khẩu"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng nhập
            </Button>
            <a href="javascrip:void(0)">Quên mật khẩu</a>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
