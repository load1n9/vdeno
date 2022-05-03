interface Token {
  name: string;
  params: string[];
  output: string[];
}
function getExtension(): string {
  let libSuffix = "dll";
  switch (Deno.build.os) {
    case "windows":
      libSuffix = "dll";
      break;
    case "darwin":
      libSuffix = "dylib";
      break;
    case "linux":
      libSuffix = "so";
      break;
  }
  return libSuffix;
}

class Parser {
  #input: string[];
  #output: Token[] = [];
  constructor(input: string) {
    this.#input = input.match(
      /(?:\/\*(?:[^\*]|\**[^\*\/])*\*+\/)|(?:\/\/[\S ]*)/g,
    )!;
    this.#clean();
    for (const line of this.#input) {
      this.#output.push(this.tokenize(line));
    }
  }
  #clean() {
    this.#input = this.#input.map((line) =>
      line.replace("//", "").replace(/(\r\n|\n|\r)/gm, "").replace(
        /\/\*|\*\//g,
        "",
      )
    );
  }
  tokenize(line: string): Token {
    const [name, parameters, output] = line.replace(
      /[\])}[{(]/g,
      "",
    ).split("->");
    return {
      name: name.trim(),
      params: parameters.replace(/ /g, "").split(","),
      output: output.replace(/ /g, "").split(","),
    };
  }
  get output() {
    return this.#output;
  }
}

class Instance {
  #file: string;
  #ast: Token[];
  // deno-lint-ignore no-explicit-any
  symbols: any = {};
  constructor(fileName: string) {
    const name = fileName.split(".")[0];
    this.#file = Deno.readTextFileSync(fileName);
    this.#ast = new Parser(this.#file).output;
    for (const token of this.#ast) {
      this.symbols[token.name] = {
        parameters: token.params,
        result: token.output,
      };
    }
    Deno.writeTextFileSync(`${name}.json`, JSON.stringify(this.symbols));
  }
}

new Instance(Deno.args[0]);
