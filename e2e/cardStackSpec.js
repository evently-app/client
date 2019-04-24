describe("Feed", () => {
	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it("should show feed", async () => {
		await expect(element(by.id("eventCard"))).toBeVisible();
	});

	it("should show another card after swipe", async () => {
		await element(by.id("eventCard")).swipe();
		await expect(element(by.id("card"))).toBeVisible();
	});
});
