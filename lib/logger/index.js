module.exports = new Proxy(
	{},
	{
		get: () => (...args) => console.log(
			new Date().toISOString().replace(/^.*T|\..*$/g, ''),
			...args,
		),
	},
);
