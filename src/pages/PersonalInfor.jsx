import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function PersonnalInfor() {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    fullName: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Ghép ngày/tháng/năm thành chuỗi
    const birthDate = `${info.day}/${info.month}/${info.year}`;
    const finalData = { ...info, birthDate };

    localStorage.setItem("personalInfo", JSON.stringify(finalData));
    alert("Thông tin cá nhân đã được lưu thành công!");
    navigate("/settings");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="shadow-lg p-4">
            <h3 className="text-center mb-4 text-primary">
              Nhập thông tin cá nhân
            </h3>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={info.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ngày sinh</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Ngày"
                      name="day"
                      value={info.day}
                      onChange={handleChange}
                      min="1"
                      max="31"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Tháng"
                      name="month"
                      value={info.month}
                      onChange={handleChange}
                      min="1"
                      max="12"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Năm"
                      name="year"
                      value={info.year}
                      onChange={handleChange}
                      min="1900"
                      max="2100"
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                  name="gender"
                  value={info.gender}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={info.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={info.address}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit" className="px-4">
                  Lưu thông tin
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
