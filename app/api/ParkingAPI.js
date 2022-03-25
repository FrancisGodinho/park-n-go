import axios from "axios";
//const base_url = "http://127.0.0.1:8080";
const base_url = "http://ec2-3-85-235-244.compute-1.amazonaws.com:8080";

function get(route, params) {
  return axios.get(base_url + route, params);
}
function post(route, params) {
  return axios.post(base_url + route, params); // fix this!
}

class ParkingAPI {
  static async getTest() {
    const data = await get("/test", {
      params: {},
    });
    return data.data;
  }
}

export default ParkingAPI;
