import React from 'react';
import PropTypes from 'prop-types';

const ModalVentas = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg z-50">
        {children}
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

ModalVentas.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ModalVentas;