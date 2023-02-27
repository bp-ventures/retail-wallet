export const CreatePopup = (popupUrl, width = 500, height = 800) => {
  const url = new URL(popupUrl);
  const popup = open(
    url.toString(),
    "popup",
    `width=${width}},height=${height}"`
  );

  if (!popup) {
    throw new Error(
      "Popups are blocked. You’ll need to enable popups for this demo to work"
    );
  }

  return popup;
};
