import umami from "@umami/node";

umami.init({
  websiteId: "c24b1843-714e-4ac7-9979-d2687dd11172", // Your website id
  hostUrl: "https://cloud.umami.is", // URL to your Umami instance
});

export const umamiTrackCheckoutSuccessEvent = async (payload: {
  [key: string]: string | number | Date;
}) => {
  await umami.track("checkout_success", payload);
};
