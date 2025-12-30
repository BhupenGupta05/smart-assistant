export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
