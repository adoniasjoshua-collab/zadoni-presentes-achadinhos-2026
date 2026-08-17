(function (w) {
  const N = w.ZadoniCesta;
  const c = N.config;

  function criar() {
    const agora = new Date().toISOString();
    return {
      versao: 3,
      modelo: '',
      nivel: '',
      preferencias: {
        ocasiao: '',
        dataEntrega: '',
        observacoes: ''
      },
      criadoEm: agora,
      atualizadoEm: agora
    };
  }

  function disponivel() {
    try {
      localStorage.setItem('__zadoni_teste', '1');
      localStorage.removeItem('__zadoni_teste');
      return true;
    } catch (e) {
      return false;
    }
  }

  function carregar() {
    if (!disponivel()) return null;
    try {
      const estado = JSON.parse(localStorage.getItem(c.STORAGE_KEY) || 'null');
      const expirado = !estado || !estado.atualizadoEm || Date.now() - new Date(estado.atualizadoEm).getTime() > c.EXPIRATION_MS;
      return estado && estado.versao === 3 && !expirado ? estado : null;
    } catch (e) {
      return null;
    }
  }

  function salvar(estado) {
    estado.atualizadoEm = new Date().toISOString();
    if (disponivel()) {
      try {
        localStorage.setItem(c.STORAGE_KEY, JSON.stringify(estado));
      } catch (e) {}
    }
    return estado;
  }

  function limpar() {
    if (disponivel()) localStorage.removeItem(c.STORAGE_KEY);
  }

  N.storage = { criar, carregar, salvar, limpar };
})(window);
