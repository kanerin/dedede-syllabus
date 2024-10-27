import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>送信確認</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>テスト結果を送信しますか？</p>
        <p>送信後は回答をやり直すことはできません。</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          送信
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;