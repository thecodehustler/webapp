const mod = {
    state: {
        offline: false,
        updateAvaliable: false,
    },
    mutations: {
        updateAvaliable(state) {
            state.updateAvaliable = true;
        },
        servingOffline(state) {
            state.servingOffline = true;
        },
        deviceOnline(state) {
            state.servingOffline = false;
        }
    }
}

export default mod;