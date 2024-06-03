const API_URL = '/v1'

async function httpGetPlanets() {
    const response = await fetch(`${API_URL}/planets`)

    return await response.json()
}

async function httpGetLaunches() {
    const response = await fetch(`${API_URL}/launches`)

    const launches =  await response.json()

    return launches.sort((a, b) => a.flightNumber - b.flightNumber)
}

async function httpSubmitLaunch(launch) {
    try {
        return await fetch(`${API_URL}/launches`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(launch),
        })
    } catch (e) {
        return {ok: false}
    }
}

async function httpAbortLaunch(id) {
    try {
        return await fetch(`${API_URL}/launches/${id}`, {
            method: "DELETE"
        })
    } catch (e) {
        return {ok: false}
    }
}

export {
    httpGetPlanets,
    httpGetLaunches,
    httpSubmitLaunch,
    httpAbortLaunch,
};
