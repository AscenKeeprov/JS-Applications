class ArgumentError extends Error {
	constructor(argumentName, objectType) {
		let errorMessage = 'Invalid '
			+ (objectType ? `${objectType.toLowerCase()} ` : '')
			+ (argumentName ? `${argumentName.toLowerCase()}!` : 'argument!');
		super(errorMessage);
		this.name = ArgumentError.name;
	}
}
class Country {
	constructor(name) {
		this._type = this.constructor.name;
		this.name = validateObjectName(name, this._type);
		return this;
	}
}
class Town {
	constructor(name, country) {
		this._type = this.constructor.name;
		this.name = validateObjectName(name, this._type);
		if (country && country._type === Country.name) {
			this.country = country;
		} else throw new ReferenceError(`Invalid/no country specified for town '${this.name}'!`);
		return this;
	}
}
function validateObjectName(name, objectType) {
	const validNameRegExp = /^([A-Z][a-z'-]+(?: *[A-Za-z][a-z'-]*)*)$/g;
	if (name && typeof name === 'string'
		&& validNameRegExp.test(name)) {
		return name;
	} else throw new ArgumentError('name', objectType);
}