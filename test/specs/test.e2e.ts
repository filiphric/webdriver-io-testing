import { expect,browser, $ } from '@wdio/globals'

it('open all three doors (expect)', async () => {
    await browser.url(`/`)

    const startGameButton = $('[data-test="start-game-button"]')
    await startGameButton.waitForDisplayed()
    await startGameButton.click()

    const door1 = $('aria/Door 1')
    const door2 = $('aria/Door 2')
    const door3 = $('aria/Door 3')

    await expect(door1).toBeDisplayed()
    await expect(door2).toBeDisplayed()
    await expect(door3).toBeDisplayed()
   
})