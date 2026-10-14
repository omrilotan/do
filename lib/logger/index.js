const time = () => new Date().toISOString().replace(/^.*T|\..*$/g, "");

export default {
	info: (...args) => console.log(time(), ...args),
	error: (...args) => console.error(time(), ...args),
};
