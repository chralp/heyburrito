import log from 'bog';

// Defaults
const ALLOWED_VERBS: string[] = ['post', 'get'];

/**
 * Save All routes in array
*/
const apiRoutes = [];

/**
 * "Clean up path", split by / and remove args
*/
const cleanUp = (path: string) => {
    const arr = path.split('/');
    const result = arr.map(x => {
        if (x.length && !x.match(/{/)) return x;
    });

    const cleaned = result.filter(item => item);
    return cleaned;
};

/**
 * Api route handler
 */
class Route {

    /**
     * Add / register endpoints
     * check if endpoint is allowed and if it already exists
     */
    add({ method, path, handler }): void {
        method = method.toLowerCase();
        if (ALLOWED_VERBS.includes(method)) {
            if (!apiRoutes.length) {
                apiRoutes.push({ method, path, handler });
            } else {
                apiRoutes.map(x => {
                    if (x.path == path && x.method == method) {
                        throw new Error(`API endpoint already registerd, method: ${method}, path: ${path}`)
                    } else {
                        apiRoutes.push({ method, path, handler });
                    }
                });
            }
        } else {
            throw new Error(`Method not allowed, method: ${method}, path: ${path}`)
        }
    };


    /**
     * Check request if path is registerd
     * Also get all params posted and assign to request object
     */
    check({ method, path, req }) {

        log.debug('Route :: check :: ', method, path)

        /**
         * Get registerd endpoint, match method and path.
         */
        const [route] = apiRoutes.filter(x => {

            // Clean up paths
            const routeSplitted: string[] = cleanUp(x.path)
            const reqSplitted: string[] = cleanUp(path)

            let routeUrl = '';
            let reqUrl = '';

            routeSplitted.map(x => routeUrl += `${x}/`);
            reqSplitted.map(x => reqUrl += `${x}/`);

            if (method === x.method && reqUrl.startsWith(routeUrl)) return x;
        });

        // Unless route not found, return error
        if (!route) return { error: true };

        // Args that we want
        const routeArgs = route.path.match(/{(.*?)}/gmi)

        // Get args from request
        const routePath = route.path.split('/');
        const reqPath = path.split('/');

        const reqArgs = reqPath.filter(x => !routePath.includes(x));

        const args = reqArgs.map(x => {
            const key = routeArgs.shift();
            const keyClean = key ? key.replace(/\{|\}/gi, '') : undefined;
            if (keyClean) return { [keyClean]: x }
        });

        // New object to save args
        let argsObject = {};

        // Merge objects to one object
        args.forEach(el => argsObject = Object.assign({}, argsObject, el));

        // Add args to req object
        req.params = argsObject

        // Plocka ut params from url
        const request = req;
        return { route, request }

    };
}

export default new Route();
