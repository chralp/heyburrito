import { default as log } from 'bog';
import bootstrap from './bootstrap'
import heyburrito from './heyburrito'
async function boot() {
    log.info("Running bootstrap")
    const data = await bootstrap()
    return data
}
log.info("Staring heyburrito")
boot().then((config) => {
    log.info("Bootstrap done")
    heyburrito(config)
})
