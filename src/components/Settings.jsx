import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";

export default function Settings() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("personalInfor");
    if (stored) setInfo(JSON.parse(stored));
  }, []);

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        <h3 className="text-primary mb-4 text-center">Thông tin cá nhân</h3>

        {info ? (
          <div>
            <p>
              <strong>Họ và tên:</strong> {info.fullName}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {info.birthDate}
            </p>
            <p>
              <strong>Giới tính:</strong> {info.gender}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {info.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {info.address}
            </p>
          </div>
        ) : (
          <p className="text-muted text-center">Chưa có thông tin cá nhân.</p>
        )}
      </Card>
    </Container>
  );
}
