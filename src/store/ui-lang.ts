const mod = {
  state: {
    lang: '',
  },
  mutation: {
    changeLanguage(state, newLanguage) {
      state.lang = newLanguage;
    }
  }
}

export default mod;