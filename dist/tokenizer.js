"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Copyright 2014 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var _utils = require("./utils");

var getHexValue = _utils.getHexValue;
var isLineTerminator = _utils.isLineTerminator;
var isWhitespace = _utils.isWhitespace;
var isIdentifierStart = _utils.isIdentifierStart;
var isIdentifierPart = _utils.isIdentifierPart;
var isDecimalDigit = _utils.isDecimalDigit;
var ErrorMessages = require("./errors").ErrorMessages;
var Shift = require("shift-ast");

var TokenClass = exports.TokenClass = {
  Eof: { name: "<End>" },
  Ident: { name: "Identifier", isIdentifierName: true },
  Keyword: { name: "Keyword", isIdentifierName: true },
  NumericLiteral: { name: "Numeric" },
  Punctuator: { name: "Punctuator" },
  StringLiteral: { name: "String" },
  RegularExpression: { name: "RegularExpression" },
  LineComment: { name: "Line" },
  BlockComment: { name: "Block" },
  Illegal: { name: "Illegal" }
};

var TokenType = exports.TokenType = {
  EOS: { klass: TokenClass.Eof, name: "EOS" },
  LPAREN: { klass: TokenClass.Punctuator, name: "(" },
  RPAREN: { klass: TokenClass.Punctuator, name: ")" },
  LBRACK: { klass: TokenClass.Punctuator, name: "[" },
  RBRACK: { klass: TokenClass.Punctuator, name: "]" },
  LBRACE: { klass: TokenClass.Punctuator, name: "{" },
  RBRACE: { klass: TokenClass.Punctuator, name: "}" },
  COLON: { klass: TokenClass.Punctuator, name: ":" },
  SEMICOLON: { klass: TokenClass.Punctuator, name: ";" },
  PERIOD: { klass: TokenClass.Punctuator, name: "." },
  ELLIPSIS: { klass: TokenClass.Punctuator, name: "..." },
  ARROW: { klass: TokenClass.Punctuator, name: "=>" },
  CONDITIONAL: { klass: TokenClass.Punctuator, name: "?" },
  INC: { klass: TokenClass.Punctuator, name: "++" },
  DEC: { klass: TokenClass.Punctuator, name: "--" },
  ASSIGN: { klass: TokenClass.Punctuator, name: "=" },
  ASSIGN_BIT_OR: { klass: TokenClass.Punctuator, name: "|=" },
  ASSIGN_BIT_XOR: { klass: TokenClass.Punctuator, name: "^=" },
  ASSIGN_BIT_AND: { klass: TokenClass.Punctuator, name: "&=" },
  ASSIGN_SHL: { klass: TokenClass.Punctuator, name: "<<=" },
  ASSIGN_SHR: { klass: TokenClass.Punctuator, name: ">>=" },
  ASSIGN_SHR_UNSIGNED: { klass: TokenClass.Punctuator, name: ">>>=" },
  ASSIGN_ADD: { klass: TokenClass.Punctuator, name: "+=" },
  ASSIGN_SUB: { klass: TokenClass.Punctuator, name: "-=" },
  ASSIGN_MUL: { klass: TokenClass.Punctuator, name: "*=" },
  ASSIGN_DIV: { klass: TokenClass.Punctuator, name: "/=" },
  ASSIGN_MOD: { klass: TokenClass.Punctuator, name: "%=" },
  COMMA: { klass: TokenClass.Punctuator, name: "," },
  OR: { klass: TokenClass.Punctuator, name: "||" },
  AND: { klass: TokenClass.Punctuator, name: "&&" },
  BIT_OR: { klass: TokenClass.Punctuator, name: "|" },
  BIT_XOR: { klass: TokenClass.Punctuator, name: "^" },
  BIT_AND: { klass: TokenClass.Punctuator, name: "&" },
  SHL: { klass: TokenClass.Punctuator, name: "<<" },
  SHR: { klass: TokenClass.Punctuator, name: ">>" },
  SHR_UNSIGNED: { klass: TokenClass.Punctuator, name: ">>>" },
  ADD: { klass: TokenClass.Punctuator, name: "+" },
  SUB: { klass: TokenClass.Punctuator, name: "-" },
  MUL: { klass: TokenClass.Punctuator, name: "*" },
  DIV: { klass: TokenClass.Punctuator, name: "/" },
  MOD: { klass: TokenClass.Punctuator, name: "%" },
  EQ: { klass: TokenClass.Punctuator, name: "==" },
  NE: { klass: TokenClass.Punctuator, name: "!=" },
  EQ_STRICT: { klass: TokenClass.Punctuator, name: "===" },
  NE_STRICT: { klass: TokenClass.Punctuator, name: "!==" },
  LT: { klass: TokenClass.Punctuator, name: "<" },
  GT: { klass: TokenClass.Punctuator, name: ">" },
  LTE: { klass: TokenClass.Punctuator, name: "<=" },
  GTE: { klass: TokenClass.Punctuator, name: ">=" },
  INSTANCEOF: { klass: TokenClass.Keyword, name: "instanceof" },
  IN: { klass: TokenClass.Keyword, name: "in" },
  OF: { klass: TokenClass.Keyword, name: "of" },
  NOT: { klass: TokenClass.Punctuator, name: "!" },
  BIT_NOT: { klass: TokenClass.Punctuator, name: "~" },
  DELETE: { klass: TokenClass.Keyword, name: "delete" },
  TYPEOF: { klass: TokenClass.Keyword, name: "typeof" },
  VOID: { klass: TokenClass.Keyword, name: "void" },
  BREAK: { klass: TokenClass.Keyword, name: "break" },
  CASE: { klass: TokenClass.Keyword, name: "case" },
  CATCH: { klass: TokenClass.Keyword, name: "catch" },
  CONTINUE: { klass: TokenClass.Keyword, name: "continue" },
  DEBUGGER: { klass: TokenClass.Keyword, name: "debugger" },
  DEFAULT: { klass: TokenClass.Keyword, name: "default" },
  DO: { klass: TokenClass.Keyword, name: "do" },
  ELSE: { klass: TokenClass.Keyword, name: "else" },
  FINALLY: { klass: TokenClass.Keyword, name: "finally" },
  FOR: { klass: TokenClass.Keyword, name: "for" },
  FUNCTION: { klass: TokenClass.Keyword, name: "function" },
  IF: { klass: TokenClass.Keyword, name: "if" },
  NEW: { klass: TokenClass.Keyword, name: "new" },
  RETURN: { klass: TokenClass.Keyword, name: "return" },
  SWITCH: { klass: TokenClass.Keyword, name: "switch" },
  THIS: { klass: TokenClass.Keyword, name: "this" },
  THROW: { klass: TokenClass.Keyword, name: "throw" },
  TRY: { klass: TokenClass.Keyword, name: "try" },
  VAR: { klass: TokenClass.Keyword, name: "var" },
  WHILE: { klass: TokenClass.Keyword, name: "while" },
  WITH: { klass: TokenClass.Keyword, name: "with" },
  NULL: { klass: TokenClass.Keyword, name: "null" },
  TRUE: { klass: TokenClass.Keyword, name: "true" },
  FALSE: { klass: TokenClass.Keyword, name: "false" },
  YIELD: { klass: TokenClass.Keyword, name: "yield" },
  NUMBER: { klass: TokenClass.NumericLiteral, name: "" },
  STRING: { klass: TokenClass.StringLiteral, name: "" },
  REGEXP: { klass: TokenClass.RegularExpression, name: "" },
  IDENTIFIER: { klass: TokenClass.Ident, name: "" },
  FUTURE_RESERVED_WORD: { klass: TokenClass.Keyword, name: "" },
  FUTURE_STRICT_RESERVED_WORD: { klass: TokenClass.Keyword, name: "" },
  CONST: { klass: TokenClass.Keyword, name: "const" },
  LET: { klass: TokenClass.Keyword, name: "let" },
  ILLEGAL: { klass: TokenClass.Illegal, name: "" }
};

var TT = TokenType;
var I = TT.ILLEGAL;
var F = false;
var T = true;

var ONE_CHAR_PUNCTUATOR = [I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.NOT, I, I, I, TT.MOD, TT.BIT_AND, I, TT.LPAREN, TT.RPAREN, TT.MUL, TT.ADD, TT.COMMA, TT.SUB, TT.PERIOD, TT.DIV, I, I, I, I, I, I, I, I, I, I, TT.COLON, TT.SEMICOLON, TT.LT, TT.ASSIGN, TT.GT, TT.CONDITIONAL, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.LBRACK, I, TT.RBRACK, TT.BIT_XOR, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.LBRACE, TT.BIT_OR, TT.RBRACE, TT.BIT_NOT];

var PUNCTUATOR_START = [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, F, F, T, T, F, T, T, T, T, T, T, F, T, F, F, F, F, F, F, F, F, F, F, T, T, T, T, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, T, T, F];

var IDENTIFIER_START = [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, F, T, F, F, T, F, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, F, F, F, F, F];

var Token = exports.Token = (function () {
  function Token(type, slice, octal) {
    _classCallCheck(this, Token);

    this.type = type;
    this.slice = slice;
    this.octal = octal;
  }

  _prototypeProperties(Token, null, {
    value: {
      get: function () {},
      configurable: true
    }
  });

  return Token;
})();
var IdentifierLikeToken = exports.IdentifierLikeToken = (function (Token) {
  function IdentifierLikeToken(type, slice) {
    _classCallCheck(this, IdentifierLikeToken);

    _get(Object.getPrototypeOf(IdentifierLikeToken.prototype), "constructor", this).call(this, type, slice, false);
  }

  _inherits(IdentifierLikeToken, Token);

  _prototypeProperties(IdentifierLikeToken, null, {
    value: {
      get: function () {
        return this.slice.text;
      },
      configurable: true
    }
  });

  return IdentifierLikeToken;
})(Token);
var IdentifierToken = exports.IdentifierToken = (function (IdentifierLikeToken) {
  function IdentifierToken(slice) {
    _classCallCheck(this, IdentifierToken);

    _get(Object.getPrototypeOf(IdentifierToken.prototype), "constructor", this).call(this, TokenType.IDENTIFIER, slice);
  }

  _inherits(IdentifierToken, IdentifierLikeToken);

  return IdentifierToken;
})(IdentifierLikeToken);
var KeywordToken = exports.KeywordToken = (function (IdentifierLikeToken) {
  function KeywordToken(type, slice) {
    _classCallCheck(this, KeywordToken);

    _get(Object.getPrototypeOf(KeywordToken.prototype), "constructor", this).call(this, type, slice);
  }

  _inherits(KeywordToken, IdentifierLikeToken);

  return KeywordToken;
})(IdentifierLikeToken);
var PunctuatorToken = exports.PunctuatorToken = (function (Token) {
  function PunctuatorToken(type, slice) {
    _classCallCheck(this, PunctuatorToken);

    _get(Object.getPrototypeOf(PunctuatorToken.prototype), "constructor", this).call(this, type, slice, false);
  }

  _inherits(PunctuatorToken, Token);

  _prototypeProperties(PunctuatorToken, null, {
    value: {
      get: function () {
        return this.type.name;
      },
      configurable: true
    }
  });

  return PunctuatorToken;
})(Token);
var RegularExpressionLiteralToken = exports.RegularExpressionLiteralToken = (function (Token) {
  function RegularExpressionLiteralToken(slice, value) {
    _classCallCheck(this, RegularExpressionLiteralToken);

    _get(Object.getPrototypeOf(RegularExpressionLiteralToken.prototype), "constructor", this).call(this, TokenType.REGEXP, slice, false);
    this._value = value;
  }

  _inherits(RegularExpressionLiteralToken, Token);

  _prototypeProperties(RegularExpressionLiteralToken, null, {
    value: {
      get: function () {
        return this._value;
      },
      configurable: true
    }
  });

  return RegularExpressionLiteralToken;
})(Token);
var NumericLiteralToken = exports.NumericLiteralToken = (function (Token) {
  function NumericLiteralToken(slice) {
    var _this = this;
    var value = arguments[1] === undefined ? +slice.text : arguments[1];
    var octal = arguments[2] === undefined ? false : arguments[2];
    return (function () {
      _classCallCheck(_this, NumericLiteralToken);

      _get(Object.getPrototypeOf(NumericLiteralToken.prototype), "constructor", _this).call(_this, TokenType.NUMBER, slice, octal);
      _this._value = value;
    })();
  }

  _inherits(NumericLiteralToken, Token);

  _prototypeProperties(NumericLiteralToken, null, {
    value: {
      get: function () {
        return this._value.toString();
      },
      configurable: true
    }
  });

  return NumericLiteralToken;
})(Token);
var StringLiteralToken = exports.StringLiteralToken = (function (Token) {
  function StringLiteralToken(slice, value, octal) {
    _classCallCheck(this, StringLiteralToken);

    _get(Object.getPrototypeOf(StringLiteralToken.prototype), "constructor", this).call(this, TokenType.STRING, slice, octal);
    this._value = value;
  }

  _inherits(StringLiteralToken, Token);

  _prototypeProperties(StringLiteralToken, null, {
    value: {
      get: function () {
        return this._value;
      },
      configurable: true
    }
  });

  return StringLiteralToken;
})(Token);
var EOFToken = exports.EOFToken = (function (Token) {
  function EOFToken(slice) {
    _classCallCheck(this, EOFToken);

    _get(Object.getPrototypeOf(EOFToken.prototype), "constructor", this).call(this, TokenType.EOS, slice, false);
  }

  _inherits(EOFToken, Token);

  _prototypeProperties(EOFToken, null, {
    value: {
      get: function () {
        return "";
      },
      configurable: true
    }
  });

  return EOFToken;
})(Token);
var JsError = exports.JsError = (function (Error) {
  function JsError(index, line, column, msg) {
    _classCallCheck(this, JsError);

    this.index = index;
    this.line = line;
    this.column = column;
    this.description = msg;
    this.message = "[" + line + ":" + column + "]: " + msg;
  }

  _inherits(JsError, Error);

  return JsError;
})(Error);
var Tokenizer = (function () {
  function Tokenizer(source) {
    _classCallCheck(this, Tokenizer);

    this.source = source;
    this.index = 0;
    this.line = 0;
    this.lineStart = 0;
    this.startIndex = 0;
    this.startLine = 0;
    this.startLineStart = 0;
    this.lastIndex = 0;
    this.lastLine = 0;
    this.lastLineStart = 0;
    this.lookahead = this.advance();
    this.strict = false;
    this.hasLineTerminatorBeforeNext = false;
    this.prevToken = null;
    this.tokenIndex = 0;
  }

  _prototypeProperties(Tokenizer, {
    cse2: {
      value: function cse2(id, ch1, ch2) {
        return id.charAt(1) === ch1 && id.charAt(2) === ch2;
      },
      writable: true,
      configurable: true
    },
    cse3: {
      value: function cse3(id, ch1, ch2, ch3) {
        return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3;
      },
      writable: true,
      configurable: true
    },
    cse4: {
      value: function cse4(id, ch1, ch2, ch3, ch4) {
        return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4;
      },
      writable: true,
      configurable: true
    },
    cse5: {
      value: function cse5(id, ch1, ch2, ch3, ch4, ch5) {
        return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5;
      },
      writable: true,
      configurable: true
    },
    cse6: {
      value: function cse6(id, ch1, ch2, ch3, ch4, ch5, ch6) {
        return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5 && id.charAt(6) === ch6;
      },
      writable: true,
      configurable: true
    },
    cse7: {
      value: function cse7(id, ch1, ch2, ch3, ch4, ch5, ch6, ch7) {
        return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5 && id.charAt(6) === ch6 && id.charAt(7) === ch7;
      },
      writable: true,
      configurable: true
    },
    getKeyword: {
      value: function getKeyword(id, strict) {
        // "const" is specialized as Keyword in V8.
        // "yield" and "let" are for compatibility with SpiderMonkey and ES.next.
        // Some others are from future reserved words.

        if (id.length === 1 || id.length > 10) {
          return TokenType.ILLEGAL;
        }

        /* istanbul ignore next */
        switch (id.length) {
          case 2:
            switch (id.charAt(0)) {
              case "i":
                switch (id.charAt(1)) {
                  case "f":
                    return TokenType.IF;
                  case "n":
                    return TokenType.IN;
                  default:
                    break;
                }
                break;
              case "d":
                if (id.charAt(1) === "o") {
                  return TokenType.DO;
                }
                break;
              case "o":
                if (id.charAt(1) === "f") {
                  return TokenType.OF;
                }
              default:
                break;
            }
            break;
          case 3:
            switch (id.charAt(0)) {
              case "v":
                if (Tokenizer.cse2(id, "a", "r")) {
                  return TokenType.VAR;
                }
                break;
              case "f":
                if (Tokenizer.cse2(id, "o", "r")) {
                  return TokenType.FOR;
                }
                break;
              case "n":
                if (Tokenizer.cse2(id, "e", "w")) {
                  return TokenType.NEW;
                }
                break;
              case "t":
                if (Tokenizer.cse2(id, "r", "y")) {
                  return TokenType.TRY;
                }
                break;
              case "l":
                if (Tokenizer.cse2(id, "e", "t")) {
                  return strict ? TokenType.FUTURE_STRICT_RESERVED_WORD : TokenType.LET;
                }
                break;
              default:
                break;
            }
            break;
          case 4:
            switch (id.charAt(0)) {
              case "t":
                if (Tokenizer.cse3(id, "h", "i", "s")) {
                  return TokenType.THIS;
                } else if (Tokenizer.cse3(id, "r", "u", "e")) {
                  return TokenType.TRUE;
                }
                break;
              case "n":
                if (Tokenizer.cse3(id, "u", "l", "l")) {
                  return TokenType.NULL;
                }
                break;
              case "e":
                if (Tokenizer.cse3(id, "l", "s", "e")) {
                  return TokenType.ELSE;
                } else if (Tokenizer.cse3(id, "n", "u", "m")) {
                  return TokenType.FUTURE_RESERVED_WORD;
                }
                break;
              case "c":
                if (Tokenizer.cse3(id, "a", "s", "e")) {
                  return TokenType.CASE;
                }
                break;
              case "v":
                if (Tokenizer.cse3(id, "o", "i", "d")) {
                  return TokenType.VOID;
                }
                break;
              case "w":
                if (Tokenizer.cse3(id, "i", "t", "h")) {
                  return TokenType.WITH;
                }
                break;
              default:
                break;
            }
            break;
          case 5:
            switch (id.charAt(0)) {
              case "w":
                // WHILE
                if (Tokenizer.cse4(id, "h", "i", "l", "e")) {
                  return TokenType.WHILE;
                }
                break;
              case "b":
                // BREAK
                if (Tokenizer.cse4(id, "r", "e", "a", "k")) {
                  return TokenType.BREAK;
                }
                break;
              case "f":
                // FALSE
                if (Tokenizer.cse4(id, "a", "l", "s", "e")) {
                  return TokenType.FALSE;
                }
                break;
              case "c":
                // CATCH
                if (Tokenizer.cse4(id, "a", "t", "c", "h")) {
                  return TokenType.CATCH;
                } else if (Tokenizer.cse4(id, "o", "n", "s", "t")) {
                  return TokenType.CONST;
                } else if (Tokenizer.cse4(id, "l", "a", "s", "s")) {
                  return TokenType.FUTURE_RESERVED_WORD;
                }
                break;
              case "t":
                // THROW
                if (Tokenizer.cse4(id, "h", "r", "o", "w")) {
                  return TokenType.THROW;
                }
                break;
              case "y":
                // YIELD
                if (Tokenizer.cse4(id, "i", "e", "l", "d")) {
                  return strict ? TokenType.FUTURE_STRICT_RESERVED_WORD : TokenType.ILLEGAL;
                }
                break;
              case "s":
                // SUPER
                if (Tokenizer.cse4(id, "u", "p", "e", "r")) {
                  return TokenType.FUTURE_RESERVED_WORD;
                }
                break;
              default:
                break;
            }
            break;
          case 6:
            switch (id.charAt(0)) {
              case "r":
                if (Tokenizer.cse5(id, "e", "t", "u", "r", "n")) {
                  return TokenType.RETURN;
                }
                break;
              case "t":
                if (Tokenizer.cse5(id, "y", "p", "e", "o", "f")) {
                  return TokenType.TYPEOF;
                }
                break;
              case "d":
                if (Tokenizer.cse5(id, "e", "l", "e", "t", "e")) {
                  return TokenType.DELETE;
                }
                break;
              case "s":
                if (Tokenizer.cse5(id, "w", "i", "t", "c", "h")) {
                  return TokenType.SWITCH;
                } else if (strict && Tokenizer.cse5(id, "t", "a", "t", "i", "c")) {
                  return TokenType.FUTURE_STRICT_RESERVED_WORD;
                }
                break;
              case "e":
                if (Tokenizer.cse5(id, "x", "p", "o", "r", "t")) {
                  return TokenType.FUTURE_RESERVED_WORD;
                }
                break;
              case "i":
                if (Tokenizer.cse5(id, "m", "p", "o", "r", "t")) {
                  return TokenType.FUTURE_RESERVED_WORD;
                }
                break;
              case "p":
                if (strict && Tokenizer.cse5(id, "u", "b", "l", "i", "c")) {
                  return TokenType.FUTURE_STRICT_RESERVED_WORD;
                }
                break;
              default:
                break;
            }
            break;
          case 7:
            switch (id.charAt(0)) {
              case "d":
                // default
                if (Tokenizer.cse6(id, "e", "f", "a", "u", "l", "t")) {
                  return TokenType.DEFAULT;
                }
                break;
              case "f":
                // finally
                if (Tokenizer.cse6(id, "i", "n", "a", "l", "l", "y")) {
                  return TokenType.FINALLY;
                }
                break;
              case "e":
                // extends
                if (Tokenizer.cse6(id, "x", "t", "e", "n", "d", "s")) {
                  return TokenType.FUTURE_RESERVED_WORD;
                }
                break;
              case "p":
                if (strict) {
                  var s = id;
                  if ("private" === s || "package" === s) {
                    return TokenType.FUTURE_STRICT_RESERVED_WORD;
                  }
                }
                break;
              default:
                break;
            }
            break;
          case 8:
            switch (id.charAt(0)) {
              case "f":
                if (Tokenizer.cse7(id, "u", "n", "c", "t", "i", "o", "n")) {
                  return TokenType.FUNCTION;
                }
                break;
              case "c":
                if (Tokenizer.cse7(id, "o", "n", "t", "i", "n", "u", "e")) {
                  return TokenType.CONTINUE;
                }
                break;
              case "d":
                if (Tokenizer.cse7(id, "e", "b", "u", "g", "g", "e", "r")) {
                  return TokenType.DEBUGGER;
                }
                break;
              default:
                break;
            }
            break;
          case 9:
            if (strict && (id.charAt(0) === "p" || id.charAt(0) === "i")) {
              var s = id;
              if ("protected" === s || "interface" === s) {
                return TokenType.FUTURE_STRICT_RESERVED_WORD;
              }
            }
            break;
          case 10:
            {
              var s = id;
              if ("instanceof" === s) {
                return TokenType.INSTANCEOF;
              } else if (strict && "implements" === s) {
                return TokenType.FUTURE_STRICT_RESERVED_WORD;
              }
            }
            break;
          default:
            break;
        }
        return TokenType.ILLEGAL;
      },
      writable: true,
      configurable: true
    }
  }, {
    createILLEGAL: {
      value: function createILLEGAL() {
        this.startIndex = this.index;
        this.startLine = this.line;
        this.startLineStart = this.lineStart;
        return this.createError(ErrorMessages.UNEXPECTED_ILLEGAL_TOKEN);
      },
      writable: true,
      configurable: true
    },
    createUnexpected: {
      value: function createUnexpected(token) {
        switch (token.type.klass) {
          case TokenClass.Eof:
            return this.createError(ErrorMessages.UNEXPECTED_EOS);
          case TokenClass.NumericLiteral:
            return this.createError(ErrorMessages.UNEXPECTED_NUMBER);
          case TokenClass.StringLiteral:
            return this.createError(ErrorMessages.UNEXPECTED_STRING);
          case TokenClass.Ident:
            return this.createError(ErrorMessages.UNEXPECTED_IDENTIFIER);
          case TokenClass.Keyword:
            if (token.type === TokenType.FUTURE_RESERVED_WORD) {
              return this.createError(ErrorMessages.UNEXPECTED_RESERVED_WORD);
            }
            if (token.type === TokenType.FUTURE_STRICT_RESERVED_WORD) {
              return this.createError(ErrorMessages.STRICT_RESERVED_WORD);
            }
            return this.createError(ErrorMessages.UNEXPECTED_TOKEN, token.slice.text);
          case TokenClass.Punctuator:
            return this.createError(ErrorMessages.UNEXPECTED_TOKEN, token.type.name);
          default:
            break;
        }
        return this.createError(ErrorMessages.UNEXPECTED_TOKEN, token.value);
      },
      writable: true,
      configurable: true
    },
    createError: {
      value: function createError(message, arg) {
        var msg = message.replace(/{(\d+)}/g, function () {
          return arg;
        });
        return new JsError(this.startIndex, this.startLine + 1, this.startIndex - this.startLineStart + 1, msg);
      },
      writable: true,
      configurable: true
    },
    createErrorWithLocation: {
      value: function createErrorWithLocation(location, message, arg) {
        var msg = message.replace(/{(\d+)}/g, function () {
          return arg;
        });
        return new JsError(location.offset, location.line, location.column + 1, msg);
      },
      writable: true,
      configurable: true
    },
    skipSingleLineComment: {
      value: function skipSingleLineComment(offset) {
        this.index += offset;
        while (this.index < this.source.length) {
          /**
           * @type {Number}
           */
          var chCode = this.source.charCodeAt(this.index);
          this.index++;
          if (isLineTerminator(chCode)) {
            this.hasLineTerminatorBeforeNext = true;
            if (chCode === 13 /* "\r" */ && this.index < this.source.length && this.source.charCodeAt(this.index) === 10 /*"\n" */) {
              this.index++;
            }
            this.lineStart = this.index;
            this.line++;
            return;
          }
        }
      },
      writable: true,
      configurable: true
    },
    skipMultiLineComment: {
      value: function skipMultiLineComment() {
        this.index += 2;
        var length = this.source.length;

        while (this.index < length) {
          var chCode = this.source.charCodeAt(this.index);
          if (chCode < 128) {
            switch (chCode) {
              case 42:
                // "*"
                // Block comment ends with "*/'.
                if (this.index + 1 < length && this.source.charAt(this.index + 1) === "/") {
                  this.index = this.index + 2;
                  return;
                }
                this.index++;
                break;
              case 10:
                // "\n"
                this.hasLineTerminatorBeforeNext = true;
                this.index++;
                this.lineStart = this.index;
                this.line++;
                break;
              case 13:
                // "\r":
                this.hasLineTerminatorBeforeNext = true;
                if (this.index < length - 1 && this.source.charAt(this.index + 1) === "\n") {
                  this.index++;
                }
                this.index++;
                this.lineStart = this.index;
                this.line++;
                break;
              default:
                this.index++;
            }
          } else if (chCode === 8232 || chCode === 8233) {
            this.hasLineTerminatorBeforeNext = true;
            this.index++;
            this.lineStart = this.index;
            this.line++;
          } else {
            this.index++;
          }
        }
        throw this.createILLEGAL();
      },
      writable: true,
      configurable: true
    },
    skipComment: {
      value: function skipComment() {
        this.hasLineTerminatorBeforeNext = false;

        var isLineStart = this.index === 0;
        var length = this.source.length;

        while (this.index < length) {
          var chCode = this.source.charCodeAt(this.index);
          if (isWhitespace(chCode)) {
            this.index++;
          } else if (isLineTerminator(chCode)) {
            this.hasLineTerminatorBeforeNext = true;
            this.index++;
            if (chCode === 13 /* "\r" */ && this.index < length && this.source.charAt(this.index) === "\n") {
              this.index++;
            }
            this.lineStart = this.index;
            this.line++;
            isLineStart = true;
          } else if (chCode === 47 /* "/" */) {
            if (this.index + 1 >= length) {
              break;
            }
            chCode = this.source.charCodeAt(this.index + 1);
            if (chCode === 47 /* "/" */) {
              this.skipSingleLineComment(2);
              isLineStart = true;
            } else if (chCode === 42 /* "*" */) {
              this.skipMultiLineComment();
            } else {
              break;
            }
          } else if (isLineStart && chCode === 45 /* "-" */) {
            if (this.index + 2 >= length) {
              break;
            }
            // U+003E is ">'
            if (this.source.charAt(this.index + 1) === "-" && this.source.charAt(this.index + 2) === ">") {
              // "-->" is a single-line comment
              this.skipSingleLineComment(3);
            } else {
              break;
            }
          } else if (chCode === 60 /* "<" */) {
            if (this.index + 4 <= length && this.source.charAt(this.index + 1) === "!" && this.source.charAt(this.index + 2) === "-" && this.source.charAt(this.index + 3) === "-") {
              this.skipSingleLineComment(4);
            } else {
              break;
            }
          } else {
            break;
          }
        }
      },
      writable: true,
      configurable: true
    },
    scanHexEscape2: {
      value: function scanHexEscape2() {
        if (this.index + 2 > this.source.length) {
          return -1;
        }
        var r1 = getHexValue(this.source.charAt(this.index));
        if (r1 === -1) {
          return -1;
        }
        var r2 = getHexValue(this.source.charAt(this.index + 1));
        if (r2 === -1) {
          return -1;
        }
        this.index += 2;
        return r1 << 4 | r2;
      },
      writable: true,
      configurable: true
    },
    scanUnicode: {
      value: function scanUnicode() {
        if (this.source.charAt(this.index) === "{") {
          //\u{HexDigits}
          var i = this.index + 1;
          var hexDigits = 0,
              ch = undefined;
          while (i < this.source.length) {
            ch = this.source.charAt(i);
            var hex = getHexValue(ch);
            if (hex === -1) {
              break;
            }
            hexDigits = hexDigits << 4 | hex;
            if (hexDigits > 1114111) {
              throw this.createILLEGAL();
            }
            i++;
          }
          if (ch !== "}") {
            return -1;
          }
          this.index = i + 1;
          return hexDigits;
        } else {
          //\uHex4Digits
          if (this.index + 4 > this.source.length) {
            return -1;
          }
          var r1 = getHexValue(this.source.charAt(this.index));
          if (r1 === -1) {
            return -1;
          }
          var r2 = getHexValue(this.source.charAt(this.index + 1));
          if (r2 === -1) {
            return -1;
          }
          var r3 = getHexValue(this.source.charAt(this.index + 2));
          if (r3 === -1) {
            return -1;
          }
          var r4 = getHexValue(this.source.charAt(this.index + 3));
          if (r4 === -1) {
            return -1;
          }
          this.index += 4;
          return r1 << 12 | r2 << 8 | r3 << 4 | r4;
        }
      },
      writable: true,
      configurable: true
    },
    getEscapedIdentifier: {
      value: function getEscapedIdentifier() {
        var ch = this.source.charAt(this.index);
        this.index++;
        if (this.index >= this.source.length) {
          throw this.createILLEGAL();
        }

        var id = "";

        if (ch === "\\") {
          if (this.source.charAt(this.index) !== "u") {
            throw this.createILLEGAL();
          }
          this.index++;
          if (this.index >= this.source.length) {
            throw this.createILLEGAL();
          }
          var ich = this.scanUnicode();
          if (ich < 0 || ich === 92 /* "\\" */ || !isIdentifierStart(ich)) {
            throw this.createILLEGAL();
          }
          ch = String.fromCharCode(ich);
        }
        id += ch;

        while (this.index < this.source.length) {
          ch = this.source.charAt(this.index);
          if (!isIdentifierPart(ch.charCodeAt(0)) && ch !== "\\") {
            break;
          }
          this.index++;
          if (ch === "\\") {
            if (this.index >= this.source.length) {
              throw this.createILLEGAL();
            }
            if (this.source.charAt(this.index) !== "u") {
              throw this.createILLEGAL();
            }
            this.index++;
            if (this.index >= this.source.length) {
              throw this.createILLEGAL();
            }
            var ich = this.scanUnicode();
            if (ich < 0 || ich === 92 /* "\\" */ || !isIdentifierPart(ich)) {
              throw this.createILLEGAL();
            }
            ch = String.fromCharCode(ich);
          }
          id += ch;
        }

        return id;
      },
      writable: true,
      configurable: true
    },
    getIdentifier: {
      value: function getIdentifier() {
        var start = this.index;
        this.index++;
        var l = this.source.length;
        var i = this.index;
        while (i < l) {
          var ch = this.source.charAt(i);
          if (ch === "\\") {
            // Go back and try the hard one.
            this.index = start;
            return this.getEscapedIdentifier();
          } else if (isIdentifierPart(ch.charCodeAt(0))) {
            i++;
          } else {
            break;
          }
        }
        this.index = i;
        return this.source.slice(start, this.index);
      },
      writable: true,
      configurable: true
    },
    scanIdentifier: {
      value: function scanIdentifier() {
        var startLocation = this.getLocation();
        var start = this.index;

        // Backslash (U+005C) starts an escaped character.
        var id = this.source.charAt(this.index) === "\\" ? this.getEscapedIdentifier() : this.getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        var slice = this.getSlice(start, startLocation);
        slice.text = id;

        if (id.length === 1) {
          return new IdentifierToken(slice);
        }

        var subType = Tokenizer.getKeyword(id, this.strict);
        if (subType !== TokenType.ILLEGAL) {
          return new KeywordToken(subType, slice);
        }

        return new IdentifierToken(slice);
      },
      writable: true,
      configurable: true
    },
    getLocation: {
      value: function getLocation() {
        return new Shift.SourceLocation(this.startIndex, this.startLine + 1, this.startIndex - this.startLineStart);
      },
      writable: true,
      configurable: true
    },
    getSlice: {
      value: function getSlice(start, startLocation) {
        return { text: this.source.slice(start, this.index), start: start, startLocation: startLocation, end: this.index };
      },
      writable: true,
      configurable: true
    },
    scanPunctuatorHelper: {
      value: function scanPunctuatorHelper() {
        var ch1 = this.source.charAt(this.index);

        switch (ch1) {
          // Check for most common single-character punctuators.
          case ".":
            var ch2 = this.source.charAt(this.index + 1);
            if (ch2 !== ".") {
              return TokenType.PERIOD;
            }var ch3 = this.source.charAt(this.index + 2);
            if (ch3 !== ".") {
              return TokenType.PERIOD;
            }return TokenType.ELLIPSIS;
          case "(":
            return TokenType.LPAREN;
          case ")":
          case ";":
          case ",":
            return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
          case "{":
            return TokenType.LBRACE;
          case "}":
          case "[":
          case "]":
          case ":":
          case "?":
          case "~":
            return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
          default:
            // "=" (U+003D) marks an assignment or comparison operator.
            if (this.index + 1 < this.source.length && this.source.charAt(this.index + 1) === "=") {
              switch (ch1) {
                case "=":
                  if (this.index + 2 < this.source.length && this.source.charAt(this.index + 2) === "=") {
                    return TokenType.EQ_STRICT;
                  }
                  return TokenType.EQ;
                case "!":
                  if (this.index + 2 < this.source.length && this.source.charAt(this.index + 2) === "=") {
                    return TokenType.NE_STRICT;
                  }
                  return TokenType.NE;
                case "|":
                  return TokenType.ASSIGN_BIT_OR;
                case "+":
                  return TokenType.ASSIGN_ADD;
                case "-":
                  return TokenType.ASSIGN_SUB;
                case "*":
                  return TokenType.ASSIGN_MUL;
                case "<":
                  return TokenType.LTE;
                case ">":
                  return TokenType.GTE;
                case "/":
                  return TokenType.ASSIGN_DIV;
                case "%":
                  return TokenType.ASSIGN_MOD;
                case "^":
                  return TokenType.ASSIGN_BIT_XOR;
                case "&":
                  return TokenType.ASSIGN_BIT_AND;
                // istanbul ignore next
                default:
                  break; //failed
              }
            }
        }

        if (this.index + 1 < this.source.length) {
          var _ch2 = this.source.charAt(this.index + 1);
          if (ch1 === _ch2) {
            if (this.index + 2 < this.source.length) {
              var _ch3 = this.source.charAt(this.index + 2);
              if (ch1 === ">" && _ch3 === ">") {
                // 4-character punctuator: >>>=
                if (this.index + 3 < this.source.length && this.source.charAt(this.index + 3) === "=") {
                  return TokenType.ASSIGN_SHR_UNSIGNED;
                }
                return TokenType.SHR_UNSIGNED;
              }

              if (ch1 === "<" && _ch3 === "=") {
                return TokenType.ASSIGN_SHL;
              }

              if (ch1 === ">" && _ch3 === "=") {
                return TokenType.ASSIGN_SHR;
              }
            }
            // Other 2-character punctuators: ++ -- << >> && ||
            switch (ch1) {
              case "+":
                return TokenType.INC;
              case "-":
                return TokenType.DEC;
              case "<":
                return TokenType.SHL;
              case ">":
                return TokenType.SHR;
              case "&":
                return TokenType.AND;
              case "|":
                return TokenType.OR;
              // istanbul ignore next
              default:
                break; //failed
            }
          } else if (ch1 === "=" && _ch2 === ">") {
            return TokenType.ARROW;
          }
        }

        return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
      },
      writable: true,
      configurable: true
    },
    scanPunctuator: {

      // 7.7 Punctuators
      value: function scanPunctuator() {
        var startLocation = this.getLocation();
        var start = this.index;
        var subType = this.scanPunctuatorHelper();
        this.index += subType.name.length;
        return new PunctuatorToken(subType, this.getSlice(start, startLocation));
      },
      writable: true,
      configurable: true
    },
    scanHexLiteral: {
      value: function scanHexLiteral(start, startLocation) {
        var i = this.index;
        while (i < this.source.length) {
          var ch = this.source.charAt(i);
          var hex = getHexValue(ch);
          if (hex === -1) {
            break;
          }
          i++;
        }

        if (this.index === i) {
          throw this.createILLEGAL();
        }

        if (i < this.source.length && isIdentifierStart(this.source.charCodeAt(i))) {
          throw this.createILLEGAL();
        }

        this.index = i;

        var slice = this.getSlice(start, startLocation);
        return new NumericLiteralToken(slice, parseInt(slice.text.substr(2), 16));
      },
      writable: true,
      configurable: true
    },
    scanBinaryLiteral: {
      value: function scanBinaryLiteral(start, startLocation) {
        var offset = this.index - start;

        while (this.index < this.source.length) {
          var ch = this.source.charAt(this.index);
          if (ch !== "0" && ch !== "1") {
            break;
          }
          this.index++;
        }

        if (this.index - start <= offset) {
          throw this.createILLEGAL();
        }

        if (this.index < this.source.length && (isIdentifierStart(this.source.charCodeAt(this.index)) || isDecimalDigit(this.source.charAt(this.index)))) {
          throw this.createILLEGAL();
        }

        return new NumericLiteralToken(this.getSlice(start, startLocation), parseInt(this.getSlice(start, startLocation).text.substr(offset), 2), true);
      },
      writable: true,
      configurable: true
    },
    scanOctalLiteral: {
      value: function scanOctalLiteral(start, startLocation) {
        var offset = this.index - start;

        while (this.index < this.source.length) {
          var ch = this.source.charAt(this.index);
          if (!("0" <= ch && ch <= "7")) {
            break;
          }
          this.index++;
        }

        if (offset === 2 && this.index - start === 2) {
          throw this.createILLEGAL();
        }

        if (this.index < this.source.length && (isIdentifierStart(this.source.charCodeAt(this.index)) || isDecimalDigit(this.source.charAt(this.index)))) {
          throw this.createILLEGAL();
        }

        return new NumericLiteralToken(this.getSlice(start, startLocation), parseInt(this.getSlice(start, startLocation).text.substr(offset), 8), true);
      },
      writable: true,
      configurable: true
    },
    scanNumericLiteral: {
      value: function scanNumericLiteral() {
        var ch = this.source.charAt(this.index);
        // assert(ch === "." || "0" <= ch && ch <= "9")
        var startLocation = this.getLocation();
        var start = this.index;

        if (ch === "0") {
          this.index++;
          if (this.index < this.source.length) {
            ch = this.source.charAt(this.index);
            if (ch === "x" || ch === "X") {
              this.index++;
              return this.scanHexLiteral(start, startLocation);
            } else if (ch === "b" || ch === "B") {
              this.index++;
              return this.scanBinaryLiteral(start, startLocation);
            } else if (ch === "o" || ch === "O") {
              this.index++;
              return this.scanOctalLiteral(start, startLocation);
            } else if ("0" <= ch && ch <= "9") {
              return this.scanOctalLiteral(start, startLocation);
            }
          } else {
            return new NumericLiteralToken(this.getSlice(start, startLocation));
          }
        } else if (ch !== ".") {
          // Must be "1'..'9'
          ch = this.source.charAt(this.index);
          while ("0" <= ch && ch <= "9") {
            this.index++;
            if (this.index === this.source.length) {
              return new NumericLiteralToken(this.getSlice(start, startLocation));
            }
            ch = this.source.charAt(this.index);
          }
        }

        var e = 0;
        if (ch === ".") {
          this.index++;
          if (this.index === this.source.length) {
            return new NumericLiteralToken(this.getSlice(start, startLocation));
          }

          ch = this.source.charAt(this.index);
          while ("0" <= ch && ch <= "9") {
            e++;
            this.index++;
            if (this.index === this.source.length) {
              return new NumericLiteralToken(this.getSlice(start, startLocation));
            }
            ch = this.source.charAt(this.index);
          }
        }

        // EOF not reached here
        if (ch === "e" || ch === "E") {
          this.index++;
          if (this.index === this.source.length) {
            throw this.createILLEGAL();
          }

          ch = this.source.charAt(this.index);
          var neg = false;
          if (ch === "+" || ch === "-") {
            neg = ch === "-";
            this.index++;
            if (this.index === this.source.length) {
              throw this.createILLEGAL();
            }
            ch = this.source.charAt(this.index);
          }

          var f = 0;
          if ("0" <= ch && ch <= "9") {
            while ("0" <= ch && ch <= "9") {
              f *= 10;
              f += +ch;
              this.index++;
              if (this.index === this.source.length) {
                break;
              }
              ch = this.source.charAt(this.index);
            }
          } else {
            throw this.createILLEGAL();
          }
          e += neg ? f : -f;
        }

        if (isIdentifierStart(ch.charCodeAt(0))) {
          throw this.createILLEGAL();
        }

        return new NumericLiteralToken(this.getSlice(start, startLocation));
      },
      writable: true,
      configurable: true
    },
    scanStringLiteral: {

      // 7.8.4 String Literals
      value: function scanStringLiteral() {
        var str = "";

        var quote = this.source.charAt(this.index);
        //  assert((quote === "\"" || quote === """), "String literal must starts with a quote")

        var startLocation = this.getLocation();
        var start = this.index;
        this.index++;

        var octal = false;
        while (this.index < this.source.length) {
          var ch = this.source.charAt(this.index);
          if (ch === quote) {
            this.index++;
            return new StringLiteralToken(this.getSlice(start, startLocation), str, octal);
          } else if (ch === "\\") {
            this.index++;
            if (this.index === this.source.length) {
              throw this.createILLEGAL();
            }
            ch = this.source.charAt(this.index);
            if (!isLineTerminator(ch.charCodeAt(0))) {
              switch (ch) {
                case "n":
                  str += "\n";
                  this.index++;
                  break;
                case "r":
                  str += "\r";
                  this.index++;
                  break;
                case "t":
                  str += "\t";
                  this.index++;
                  break;
                case "u":
                case "x":
                  var restore = this.index;
                  var unescaped = undefined;
                  this.index++;
                  if (this.index >= this.source.length) {
                    throw this.createILLEGAL();
                  }
                  unescaped = ch === "u" ? this.scanUnicode() : this.scanHexEscape2();
                  if (unescaped >= 0) {
                    str += String.fromCharCode(unescaped);
                  } else {
                    this.index = restore;
                    str += ch;
                    this.index++;
                  }
                  break;
                case "b":
                  str += "\b";
                  this.index++;
                  break;
                case "f":
                  str += "\f";
                  this.index++;
                  break;
                case "v":
                  str += "\u000b";
                  this.index++;
                  break;
                default:
                  if ("0" <= ch && ch <= "7") {
                    octal = true;
                    var octLen = 1;
                    // 3 digits are only allowed when string starts
                    // with 0, 1, 2, 3
                    if ("0" <= ch && ch <= "3") {
                      octLen = 0;
                    }
                    var code = 0;
                    while (octLen < 3 && "0" <= ch && ch <= "7") {
                      code *= 8;
                      octLen++;
                      code += ch - "0";
                      this.index++;
                      if (this.index === this.source.length) {
                        throw this.createILLEGAL();
                      }
                      ch = this.source.charAt(this.index);
                    }
                    str += String.fromCharCode(code);
                  } else {
                    str += ch;
                    this.index++;
                  }
              }
            } else {
              this.hasLineTerminatorBeforeNext = true;
              this.index++;
              if (ch === "\r" && this.source.charAt(this.index) === "\n") {
                this.index++;
              }
              this.lineStart = this.index;
              this.line++;
            }
          } else if (isLineTerminator(ch.charCodeAt(0))) {
            throw this.createILLEGAL();
          } else {
            str += ch;
            this.index++;
          }
        }

        throw this.createILLEGAL();
      },
      writable: true,
      configurable: true
    },
    scanRegExp: {
      value: function scanRegExp(str) {
        var startLocation = this.getLocation();
        var start = this.index;

        var terminated = false;
        var classMarker = false;
        while (this.index < this.source.length) {
          var ch = this.source.charAt(this.index);
          if (ch === "\\") {
            str += ch;
            this.index++;
            ch = this.source.charAt(this.index);
            // ECMA-262 7.8.5
            if (isLineTerminator(ch.charCodeAt(0))) {
              throw this.createError(ErrorMessages.UNTERMINATED_REG_EXP);
            }
            str += ch;
            this.index++;
          } else if (isLineTerminator(ch.charCodeAt(0))) {
            throw this.createError(ErrorMessages.UNTERMINATED_REG_EXP);
          } else {
            if (classMarker) {
              if (ch === "]") {
                classMarker = false;
              }
            } else {
              if (ch === "/") {
                terminated = true;
                str += ch;
                this.index++;
                break;
              } else if (ch === "[") {
                classMarker = true;
              }
            }
            str += ch;
            this.index++;
          }
        }

        if (!terminated) {
          throw this.createError(ErrorMessages.UNTERMINATED_REG_EXP);
        }

        while (this.index < this.source.length) {
          var ch = this.source.charAt(this.index);
          if (!isIdentifierPart(ch.charCodeAt(0)) && ch !== "\\") {
            break;
          }
          this.index++;
          str += ch;
        }
        return new RegularExpressionLiteralToken(this.getSlice(start, startLocation), str);
      },
      writable: true,
      configurable: true
    },
    advance: {
      value: function advance() {
        var startLocation = this.getLocation();

        this.lastIndex = this.index;
        this.lastLine = this.line;
        this.lastLineStart = this.lineStart;

        this.skipComment();

        this.startIndex = this.index;
        this.startLine = this.line;
        this.startLineStart = this.lineStart;

        if (this.index >= this.source.length) {
          return new EOFToken(this.getSlice(this.index, startLocation));
        }

        var charCode = this.source.charCodeAt(this.index);

        if (charCode < 128) {
          if (PUNCTUATOR_START[charCode]) {
            return this.scanPunctuator();
          }

          if (IDENTIFIER_START[charCode]) {
            return this.scanIdentifier();
          }

          // Dot (.) U+002E can also start a floating-polet number, hence the need
          // to check the next character.
          if (charCode === 46) {
            if (this.index + 1 < this.source.length && isDecimalDigit(this.source.charAt(this.index + 1))) {
              return this.scanNumericLiteral();
            }
            return this.scanPunctuator();
          }

          // String literal starts with single quote (U+0027) or double quote (U+0022).
          if (charCode === 39 || charCode === 34) {
            return this.scanStringLiteral();
          }

          if (48 /* '0' */ <= charCode && charCode <= 57 /* '9' */) {
            return this.scanNumericLiteral();
          }

          // Slash (/) U+002F can also start a regex.
          throw this.createILLEGAL();
        } else {
          if (isIdentifierStart(charCode)) {
            return this.scanIdentifier();
          }

          throw this.createILLEGAL();
        }
      },
      writable: true,
      configurable: true
    },
    eof: {
      value: function eof() {
        return this.lookahead.type === TokenType.EOS;
      },
      writable: true,
      configurable: true
    },
    lex: {
      value: function lex() {
        this.prevToken = this.lookahead;
        this.lookahead = this.advance();
        this.tokenIndex++;
        return this.prevToken;
      },
      writable: true,
      configurable: true
    }
  });

  return Tokenizer;
})();

exports["default"] = Tokenizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90b2tlbml6ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQWlCK0csU0FBUzs7SUFBaEgsV0FBVyxVQUFYLFdBQVc7SUFBRSxnQkFBZ0IsVUFBaEIsZ0JBQWdCO0lBQUUsWUFBWSxVQUFaLFlBQVk7SUFBRSxpQkFBaUIsVUFBakIsaUJBQWlCO0lBQUUsZ0JBQWdCLFVBQWhCLGdCQUFnQjtJQUFFLGNBQWMsVUFBZCxjQUFjO0lBQ2hHLGFBQWEsV0FBTyxVQUFVLEVBQTlCLGFBQWE7SUFDVCxLQUFLLFdBQU0sV0FBVzs7QUFFM0IsSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHO0FBQ3hCLEtBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUM7QUFDcEIsT0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUM7QUFDbkQsU0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUM7QUFDbEQsZ0JBQWMsRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUM7QUFDakMsWUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQztBQUNoQyxlQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDO0FBQy9CLG1CQUFpQixFQUFFLEVBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFDO0FBQzlDLGFBQVcsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7QUFDM0IsY0FBWSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQztBQUM3QixTQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDO0NBQzNCLENBQUM7O0FBRUssSUFBTSxTQUFTLFdBQVQsU0FBUyxHQUFHO0FBQ3ZCLEtBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7QUFDekMsUUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQztBQUNqRCxRQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQ2pELFFBQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDakQsUUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQztBQUNqRCxRQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQ2pELFFBQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDakQsT0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQztBQUNoRCxXQUFTLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQ3BELFFBQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDakQsVUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztBQUNyRCxPQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQ2pELGFBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDdEQsS0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUMvQyxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQy9DLFFBQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDakQsZUFBYSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUN6RCxnQkFBYyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUMxRCxnQkFBYyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUMxRCxZQUFVLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQ3ZELFlBQVUsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7QUFDdkQscUJBQW1CLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDO0FBQ2pFLFlBQVUsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDdEQsWUFBVSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUN0RCxZQUFVLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQ3RELFlBQVUsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDdEQsWUFBVSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUN0RCxPQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQ2hELElBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDOUMsS0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUMvQyxRQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQ2pELFNBQU8sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDbEQsU0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQztBQUNsRCxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQy9DLEtBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUM7QUFDL0MsY0FBWSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztBQUN6RCxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQzlDLEtBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDOUMsS0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQztBQUM5QyxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQzlDLEtBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDOUMsSUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUM5QyxJQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQzlDLFdBQVMsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7QUFDdEQsV0FBUyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztBQUN0RCxJQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDO0FBQzdDLElBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDN0MsS0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUMvQyxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQy9DLFlBQVUsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUM7QUFDM0QsSUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUMzQyxJQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQzNDLEtBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUM7QUFDOUMsU0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQztBQUNsRCxRQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFDO0FBQ25ELFFBQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUM7QUFDbkQsTUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQztBQUMvQyxPQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFDO0FBQ2pELE1BQUksRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUM7QUFDL0MsT0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQztBQUNqRCxVQUFRLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO0FBQ3ZELFVBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7QUFDdkQsU0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztBQUNyRCxJQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQzNDLE1BQUksRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUM7QUFDL0MsU0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztBQUNyRCxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQzdDLFVBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7QUFDdkQsSUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUMzQyxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQzdDLFFBQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUM7QUFDbkQsUUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQztBQUNuRCxNQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDO0FBQy9DLE9BQUssRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUM7QUFDakQsS0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztBQUM3QyxLQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQzdDLE9BQUssRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVB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QUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDckgsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ3JILENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDcEgsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFdEYsSUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDbkgsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ25ILENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUNuSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5DLElBQU0sZ0JBQWdCLEdBQUcsQ0FDdkIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQ25ILENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUNuSCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFDbkgsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUV0QixLQUFLLFdBQUwsS0FBSztBQUNMLFdBREEsS0FBSyxDQUNKLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSzsw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RUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7T0FDN0U7Ozs7QUFFTSxRQUFJO2FBQUEsY0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ2xDLGVBQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUM7T0FDckc7Ozs7QUFFTSxRQUFJO2FBQUEsY0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUN2QyxlQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQzNHLEdBQUcsQ0FBQztPQUNiOzs7O0FBRU0sUUFBSTthQUFBLGNBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQzVDLGVBQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0s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LENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM3RixxQkFBTyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUNsQztBQUNELG1CQUFPLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztXQUM5Qjs7O0FBR0QsY0FBSSxRQUFRLEtBQUssRUFBTSxJQUFJLFFBQVEsS0FBSyxFQUFNLEVBQUU7QUFDOUMsbUJBQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7V0FDakM7O0FBRUQsY0FBSSxFQUFNLGNBQWMsUUFBUSxJQUFJLFFBQVEsSUFBSSxFQUFNLFVBQUEsRUFBWTtBQUNoRSxtQkFBTyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztXQUNsQzs7O0FBR0QsZ0JBQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQzVCLE1BQU07QUFDTCxjQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQy9CLG1CQUFPLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztXQUM5Qjs7QUFFRCxnQkFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDNUI7T0FDRjs7OztBQUVELE9BQUc7YUFBQSxlQUFHO0FBQ0osZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDO09BQzlDOzs7O0FBRUQsT0FBRzthQUFBLGVBQUc7QUFDSixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDaEMsWUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztPQUN2Qjs7Ozs7O1NBM3BDa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL3Rva2VuaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IDIwMTQgU2hhcGUgU2VjdXJpdHksIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5cbmltcG9ydCB7Z2V0SGV4VmFsdWUsIGlzTGluZVRlcm1pbmF0b3IsIGlzV2hpdGVzcGFjZSwgaXNJZGVudGlmaWVyU3RhcnQsIGlzSWRlbnRpZmllclBhcnQsIGlzRGVjaW1hbERpZ2l0fSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHtFcnJvck1lc3NhZ2VzfSBmcm9tIFwiLi9lcnJvcnNcIjtcbmltcG9ydCAqIGFzIFNoaWZ0IGZyb20gXCJzaGlmdC1hc3RcIjtcblxuZXhwb3J0IGNvbnN0IFRva2VuQ2xhc3MgPSB7XG4gIEVvZjoge25hbWU6IFwiPEVuZD5cIn0sXG4gIElkZW50OiB7bmFtZTogXCJJZGVudGlmaWVyXCIsIGlzSWRlbnRpZmllck5hbWU6IHRydWV9LFxuICBLZXl3b3JkOiB7bmFtZTogXCJLZXl3b3JkXCIsIGlzSWRlbnRpZmllck5hbWU6IHRydWV9LFxuICBOdW1lcmljTGl0ZXJhbDoge25hbWU6IFwiTnVtZXJpY1wifSxcbiAgUHVuY3R1YXRvcjoge25hbWU6IFwiUHVuY3R1YXRvclwifSxcbiAgU3RyaW5nTGl0ZXJhbDoge25hbWU6IFwiU3RyaW5nXCJ9LFxuICBSZWd1bGFyRXhwcmVzc2lvbjoge25hbWU6IFwiUmVndWxhckV4cHJlc3Npb25cIn0sXG4gIExpbmVDb21tZW50OiB7bmFtZTogXCJMaW5lXCJ9LFxuICBCbG9ja0NvbW1lbnQ6IHtuYW1lOiBcIkJsb2NrXCJ9LFxuICBJbGxlZ2FsOiB7bmFtZTogXCJJbGxlZ2FsXCJ9XG59O1xuXG5leHBvcnQgY29uc3QgVG9rZW5UeXBlID0ge1xuICBFT1M6IHtrbGFzczogVG9rZW5DbGFzcy5Fb2YsIG5hbWU6IFwiRU9TXCJ9LFxuICBMUEFSRU46IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIihcIn0sXG4gIFJQQVJFTjoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiKVwifSxcbiAgTEJSQUNLOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCJbXCJ9LFxuICBSQlJBQ0s6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIl1cIn0sXG4gIExCUkFDRToge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwie1wifSxcbiAgUkJSQUNFOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCJ9XCJ9LFxuICBDT0xPTjoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiOlwifSxcbiAgU0VNSUNPTE9OOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCI7XCJ9LFxuICBQRVJJT0Q6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIi5cIn0sXG4gIEVMTElQU0lTOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCIuLi5cIn0sXG4gIEFSUk9XOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCI9PlwifSxcbiAgQ09ORElUSU9OQUw6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIj9cIn0sXG4gIElOQzoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiKytcIn0sXG4gIERFQzoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiLS1cIn0sXG4gIEFTU0lHTjoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiPVwifSxcbiAgQVNTSUdOX0JJVF9PUjoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwifD1cIn0sXG4gIEFTU0lHTl9CSVRfWE9SOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCJePVwifSxcbiAgQVNTSUdOX0JJVF9BTkQ6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIiY9XCJ9LFxuICBBU1NJR05fU0hMOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCI8PD1cIn0sXG4gIEFTU0lHTl9TSFI6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIj4+PVwifSxcbiAgQVNTSUdOX1NIUl9VTlNJR05FRDoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiPj4+PVwifSxcbiAgQVNTSUdOX0FERDoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiKz1cIn0sXG4gIEFTU0lHTl9TVUI6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIi09XCJ9LFxuICBBU1NJR05fTVVMOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCIqPVwifSxcbiAgQVNTSUdOX0RJVjoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiLz1cIn0sXG4gIEFTU0lHTl9NT0Q6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIiU9XCJ9LFxuICBDT01NQToge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiLFwifSxcbiAgT1I6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcInx8XCJ9LFxuICBBTkQ6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIiYmXCJ9LFxuICBCSVRfT1I6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcInxcIn0sXG4gIEJJVF9YT1I6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIl5cIn0sXG4gIEJJVF9BTkQ6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIiZcIn0sXG4gIFNITDoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiPDxcIn0sXG4gIFNIUjoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiPj5cIn0sXG4gIFNIUl9VTlNJR05FRDoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiPj4+XCJ9LFxuICBBREQ6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIitcIn0sXG4gIFNVQjoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiLVwifSxcbiAgTVVMOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCIqXCJ9LFxuICBESVY6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIi9cIn0sXG4gIE1PRDoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiJVwifSxcbiAgRVE6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIj09XCJ9LFxuICBORToge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiIT1cIn0sXG4gIEVRX1NUUklDVDoge2tsYXNzOiBUb2tlbkNsYXNzLlB1bmN0dWF0b3IsIG5hbWU6IFwiPT09XCJ9LFxuICBORV9TVFJJQ1Q6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIiE9PVwifSxcbiAgTFQ6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIjxcIn0sXG4gIEdUOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCI+XCJ9LFxuICBMVEU6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIjw9XCJ9LFxuICBHVEU6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiBcIj49XCJ9LFxuICBJTlNUQU5DRU9GOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJpbnN0YW5jZW9mXCJ9LFxuICBJTjoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwiaW5cIn0sXG4gIE9GOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJvZlwifSxcbiAgTk9UOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCIhXCJ9LFxuICBCSVRfTk9UOiB7a2xhc3M6IFRva2VuQ2xhc3MuUHVuY3R1YXRvciwgbmFtZTogXCJ+XCJ9LFxuICBERUxFVEU6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcImRlbGV0ZVwifSxcbiAgVFlQRU9GOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJ0eXBlb2ZcIn0sXG4gIFZPSUQ6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcInZvaWRcIn0sXG4gIEJSRUFLOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJicmVha1wifSxcbiAgQ0FTRToge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwiY2FzZVwifSxcbiAgQ0FUQ0g6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcImNhdGNoXCJ9LFxuICBDT05USU5VRToge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwiY29udGludWVcIn0sXG4gIERFQlVHR0VSOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJkZWJ1Z2dlclwifSxcbiAgREVGQVVMVDoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwiZGVmYXVsdFwifSxcbiAgRE86IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcImRvXCJ9LFxuICBFTFNFOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJlbHNlXCJ9LFxuICBGSU5BTExZOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJmaW5hbGx5XCJ9LFxuICBGT1I6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcImZvclwifSxcbiAgRlVOQ1RJT046IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcImZ1bmN0aW9uXCJ9LFxuICBJRjoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwiaWZcIn0sXG4gIE5FVzoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwibmV3XCJ9LFxuICBSRVRVUk46IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcInJldHVyblwifSxcbiAgU1dJVENIOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJzd2l0Y2hcIn0sXG4gIFRISVM6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcInRoaXNcIn0sXG4gIFRIUk9XOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJ0aHJvd1wifSxcbiAgVFJZOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJ0cnlcIn0sXG4gIFZBUjoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwidmFyXCJ9LFxuICBXSElMRToge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwid2hpbGVcIn0sXG4gIFdJVEg6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcIndpdGhcIn0sXG4gIE5VTEw6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcIm51bGxcIn0sXG4gIFRSVUU6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcInRydWVcIn0sXG4gIEZBTFNFOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJmYWxzZVwifSxcbiAgWUlFTEQ6IHtrbGFzczogVG9rZW5DbGFzcy5LZXl3b3JkLCBuYW1lOiBcInlpZWxkXCJ9LFxuICBOVU1CRVI6IHtrbGFzczogVG9rZW5DbGFzcy5OdW1lcmljTGl0ZXJhbCwgbmFtZTogXCJcIn0sXG4gIFNUUklORzoge2tsYXNzOiBUb2tlbkNsYXNzLlN0cmluZ0xpdGVyYWwsIG5hbWU6IFwiXCJ9LFxuICBSRUdFWFA6IHtrbGFzczogVG9rZW5DbGFzcy5SZWd1bGFyRXhwcmVzc2lvbiwgbmFtZTogXCJcIn0sXG4gIElERU5USUZJRVI6IHtrbGFzczogVG9rZW5DbGFzcy5JZGVudCwgbmFtZTogXCJcIn0sXG4gIEZVVFVSRV9SRVNFUlZFRF9XT1JEOiB7a2xhc3M6IFRva2VuQ2xhc3MuS2V5d29yZCwgbmFtZTogXCJcIn0sXG4gIEZVVFVSRV9TVFJJQ1RfUkVTRVJWRURfV09SRDoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwiXCJ9LFxuICBDT05TVDoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwiY29uc3RcIn0sXG4gIExFVDoge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IFwibGV0XCJ9LFxuICBJTExFR0FMOiB7a2xhc3M6IFRva2VuQ2xhc3MuSWxsZWdhbCwgbmFtZTogXCJcIn1cbn07XG5cbmNvbnN0IFRUID0gVG9rZW5UeXBlO1xuY29uc3QgSSA9IFRULklMTEVHQUw7XG5jb25zdCBGID0gZmFsc2U7XG5jb25zdCBUID0gdHJ1ZTtcblxuY29uc3QgT05FX0NIQVJfUFVOQ1RVQVRPUiA9IFtcbiAgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgVFQuTk9ULCBJLCBJLCBJLFxuICBUVC5NT0QsIFRULkJJVF9BTkQsIEksIFRULkxQQVJFTiwgVFQuUlBBUkVOLCBUVC5NVUwsIFRULkFERCwgVFQuQ09NTUEsIFRULlNVQiwgVFQuUEVSSU9ELCBUVC5ESVYsIEksIEksIEksIEksIEksIEksIEksXG4gIEksIEksIEksIFRULkNPTE9OLCBUVC5TRU1JQ09MT04sIFRULkxULCBUVC5BU1NJR04sIFRULkdULCBUVC5DT05ESVRJT05BTCwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSxcbiAgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgSSwgVFQuTEJSQUNLLCBJLCBUVC5SQlJBQ0ssIFRULkJJVF9YT1IsIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksXG4gIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIEksIFRULkxCUkFDRSwgVFQuQklUX09SLCBUVC5SQlJBQ0UsIFRULkJJVF9OT1RdO1xuXG5jb25zdCBQVU5DVFVBVE9SX1NUQVJUID0gW1xuICBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBULCBGLCBGLCBGLCBULCBULFxuICBGLCBULCBULCBULCBULCBULCBULCBGLCBULCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBULCBULCBULCBULCBULCBULCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLFxuICBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBULCBGLCBULCBULCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLCBGLFxuICBGLCBGLCBGLCBGLCBGLCBGLCBULCBULCBULCBULCBGXTtcblxuY29uc3QgSURFTlRJRklFUl9TVEFSVCA9IFtcbiAgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgVCwgRiwgRixcbiAgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgRiwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCxcbiAgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgRiwgVCwgRiwgRiwgVCwgRiwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCwgVCxcbiAgVCwgVCwgVCwgVCwgVCwgVCwgRiwgRiwgRiwgRiwgRl07XG5cbmV4cG9ydCBjbGFzcyBUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIHNsaWNlLCBvY3RhbCkge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5zbGljZSA9IHNsaWNlO1xuICAgIHRoaXMub2N0YWwgPSBvY3RhbDtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSWRlbnRpZmllckxpa2VUb2tlbiBleHRlbmRzIFRva2VuIHtcbiAgY29uc3RydWN0b3IodHlwZSwgc2xpY2UpIHtcbiAgICBzdXBlcih0eXBlLCBzbGljZSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlLnRleHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIElkZW50aWZpZXJUb2tlbiBleHRlbmRzIElkZW50aWZpZXJMaWtlVG9rZW4ge1xuICBjb25zdHJ1Y3RvcihzbGljZSkge1xuICAgIHN1cGVyKFRva2VuVHlwZS5JREVOVElGSUVSLCBzbGljZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleXdvcmRUb2tlbiBleHRlbmRzIElkZW50aWZpZXJMaWtlVG9rZW4ge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBzbGljZSkge1xuICAgIHN1cGVyKHR5cGUsIHNsaWNlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUHVuY3R1YXRvclRva2VuIGV4dGVuZHMgVG9rZW4ge1xuICBjb25zdHJ1Y3Rvcih0eXBlLCBzbGljZSkge1xuICAgIHN1cGVyKHR5cGUsIHNsaWNlLCBmYWxzZSk7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZS5uYW1lO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWd1bGFyRXhwcmVzc2lvbkxpdGVyYWxUb2tlbiBleHRlbmRzIFRva2VuIHtcbiAgY29uc3RydWN0b3Ioc2xpY2UsIHZhbHVlKSB7XG4gICAgc3VwZXIoVG9rZW5UeXBlLlJFR0VYUCwgc2xpY2UsIGZhbHNlKTtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVtZXJpY0xpdGVyYWxUb2tlbiBleHRlbmRzIFRva2VuIHtcbiAgY29uc3RydWN0b3Ioc2xpY2UsIHZhbHVlID0gK3NsaWNlLnRleHQsIG9jdGFsID0gZmFsc2UpIHtcbiAgICBzdXBlcihUb2tlblR5cGUuTlVNQkVSLCBzbGljZSwgb2N0YWwpO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ0xpdGVyYWxUb2tlbiBleHRlbmRzIFRva2VuIHtcbiAgY29uc3RydWN0b3Ioc2xpY2UsIHZhbHVlLCBvY3RhbCkge1xuICAgIHN1cGVyKFRva2VuVHlwZS5TVFJJTkcsIHNsaWNlLCBvY3RhbCk7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVPRlRva2VuIGV4dGVuZHMgVG9rZW4ge1xuICBjb25zdHJ1Y3RvcihzbGljZSkge1xuICAgIHN1cGVyKFRva2VuVHlwZS5FT1MsIHNsaWNlLCBmYWxzZSk7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEpzRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGluZGV4LCBsaW5lLCBjb2x1bW4sIG1zZykge1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBtc2c7XG4gICAgdGhpcy5tZXNzYWdlID0gYFske2xpbmV9OiR7Y29sdW1ufV06ICR7bXNnfWA7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9rZW5pemVyIHtcbiAgY29uc3RydWN0b3Ioc291cmNlKSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5pbmRleCA9IDA7XG4gICAgdGhpcy5saW5lID0gMDtcbiAgICB0aGlzLmxpbmVTdGFydCA9IDA7XG4gICAgdGhpcy5zdGFydEluZGV4ID0gMDtcbiAgICB0aGlzLnN0YXJ0TGluZSA9IDA7XG4gICAgdGhpcy5zdGFydExpbmVTdGFydCA9IDA7XG4gICAgdGhpcy5sYXN0SW5kZXggPSAwO1xuICAgIHRoaXMubGFzdExpbmUgPSAwO1xuICAgIHRoaXMubGFzdExpbmVTdGFydCA9IDA7XG4gICAgdGhpcy5sb29rYWhlYWQgPSB0aGlzLmFkdmFuY2UoKTtcbiAgICB0aGlzLnN0cmljdCA9IGZhbHNlO1xuICAgIHRoaXMuaGFzTGluZVRlcm1pbmF0b3JCZWZvcmVOZXh0ID0gZmFsc2U7XG4gICAgdGhpcy5wcmV2VG9rZW4gPSBudWxsO1xuICAgIHRoaXMudG9rZW5JbmRleCA9IDA7XG4gIH1cblxuICBjcmVhdGVJTExFR0FMKCkge1xuICAgIHRoaXMuc3RhcnRJbmRleCA9IHRoaXMuaW5kZXg7XG4gICAgdGhpcy5zdGFydExpbmUgPSB0aGlzLmxpbmU7XG4gICAgdGhpcy5zdGFydExpbmVTdGFydCA9IHRoaXMubGluZVN0YXJ0O1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUVycm9yKEVycm9yTWVzc2FnZXMuVU5FWFBFQ1RFRF9JTExFR0FMX1RPS0VOKTtcbiAgfVxuXG4gIGNyZWF0ZVVuZXhwZWN0ZWQodG9rZW4pIHtcbiAgICBzd2l0Y2ggKHRva2VuLnR5cGUua2xhc3MpIHtcbiAgICAgIGNhc2UgVG9rZW5DbGFzcy5Fb2Y6XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUVycm9yKEVycm9yTWVzc2FnZXMuVU5FWFBFQ1RFRF9FT1MpO1xuICAgICAgY2FzZSBUb2tlbkNsYXNzLk51bWVyaWNMaXRlcmFsOlxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFcnJvcihFcnJvck1lc3NhZ2VzLlVORVhQRUNURURfTlVNQkVSKTtcbiAgICAgIGNhc2UgVG9rZW5DbGFzcy5TdHJpbmdMaXRlcmFsOlxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFcnJvcihFcnJvck1lc3NhZ2VzLlVORVhQRUNURURfU1RSSU5HKTtcbiAgICAgIGNhc2UgVG9rZW5DbGFzcy5JZGVudDpcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRXJyb3IoRXJyb3JNZXNzYWdlcy5VTkVYUEVDVEVEX0lERU5USUZJRVIpO1xuICAgICAgY2FzZSBUb2tlbkNsYXNzLktleXdvcmQ6XG4gICAgICAgIGlmICgodG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkZVVFVSRV9SRVNFUlZFRF9XT1JEKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUVycm9yKEVycm9yTWVzc2FnZXMuVU5FWFBFQ1RFRF9SRVNFUlZFRF9XT1JEKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5GVVRVUkVfU1RSSUNUX1JFU0VSVkVEX1dPUkQpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRXJyb3IoRXJyb3JNZXNzYWdlcy5TVFJJQ1RfUkVTRVJWRURfV09SRCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRXJyb3IoRXJyb3JNZXNzYWdlcy5VTkVYUEVDVEVEX1RPS0VOLCB0b2tlbi5zbGljZS50ZXh0KTtcbiAgICAgIGNhc2UgVG9rZW5DbGFzcy5QdW5jdHVhdG9yOlxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVFcnJvcihFcnJvck1lc3NhZ2VzLlVORVhQRUNURURfVE9LRU4sIHRva2VuLnR5cGUubmFtZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlRXJyb3IoRXJyb3JNZXNzYWdlcy5VTkVYUEVDVEVEX1RPS0VOLCB0b2tlbi52YWx1ZSk7XG4gIH1cblxuICBjcmVhdGVFcnJvcihtZXNzYWdlLCBhcmcpIHtcbiAgICBsZXQgbXNnID0gbWVzc2FnZS5yZXBsYWNlKC97KFxcZCspfS9nLCAoKSA9PiBhcmcpO1xuICAgIHJldHVybiBuZXcgSnNFcnJvcih0aGlzLnN0YXJ0SW5kZXgsIHRoaXMuc3RhcnRMaW5lICsgMSwgdGhpcy5zdGFydEluZGV4IC0gdGhpcy5zdGFydExpbmVTdGFydCArIDEsIG1zZyk7XG4gIH1cblxuICBjcmVhdGVFcnJvcldpdGhMb2NhdGlvbihsb2NhdGlvbiwgbWVzc2FnZSwgYXJnKSB7XG4gICAgbGV0IG1zZyA9IG1lc3NhZ2UucmVwbGFjZSgveyhcXGQrKX0vZywgKCkgPT4gYXJnKTtcbiAgICByZXR1cm4gbmV3IEpzRXJyb3IobG9jYXRpb24ub2Zmc2V0LCBsb2NhdGlvbi5saW5lLCBsb2NhdGlvbi5jb2x1bW4gKyAxLCBtc2cpO1xuICB9XG5cbiAgc3RhdGljIGNzZTIoaWQsIGNoMSwgY2gyKSB7XG4gICAgcmV0dXJuIGlkLmNoYXJBdCgxKSA9PT0gY2gxICYmIGlkLmNoYXJBdCgyKSA9PT0gY2gyO1xuICB9XG5cbiAgc3RhdGljIGNzZTMoaWQsIGNoMSwgY2gyLCBjaDMpIHtcbiAgICByZXR1cm4gaWQuY2hhckF0KDEpID09PSBjaDEgJiYgaWQuY2hhckF0KDIpID09PSBjaDIgJiYgaWQuY2hhckF0KDMpID09PSBjaDM7XG4gIH1cblxuICBzdGF0aWMgY3NlNChpZCwgY2gxLCBjaDIsIGNoMywgY2g0KSB7XG4gICAgcmV0dXJuIGlkLmNoYXJBdCgxKSA9PT0gY2gxICYmIGlkLmNoYXJBdCgyKSA9PT0gY2gyICYmIGlkLmNoYXJBdCgzKSA9PT0gY2gzICYmIGlkLmNoYXJBdCg0KSA9PT0gY2g0O1xuICB9XG5cbiAgc3RhdGljIGNzZTUoaWQsIGNoMSwgY2gyLCBjaDMsIGNoNCwgY2g1KSB7XG4gICAgcmV0dXJuIGlkLmNoYXJBdCgxKSA9PT0gY2gxICYmIGlkLmNoYXJBdCgyKSA9PT0gY2gyICYmIGlkLmNoYXJBdCgzKSA9PT0gY2gzICYmIGlkLmNoYXJBdCg0KSA9PT0gY2g0ICYmIGlkLmNoYXJBdCg1KVxuICAgICAgICA9PT0gY2g1O1xuICB9XG5cbiAgc3RhdGljIGNzZTYoaWQsIGNoMSwgY2gyLCBjaDMsIGNoNCwgY2g1LCBjaDYpIHtcbiAgICByZXR1cm4gaWQuY2hhckF0KDEpID09PSBjaDEgJiYgaWQuY2hhckF0KDIpID09PSBjaDIgJiYgaWQuY2hhckF0KDMpID09PSBjaDMgJiYgaWQuY2hhckF0KDQpID09PSBjaDQgJiYgaWQuY2hhckF0KDUpXG4gICAgICAgID09PSBjaDUgJiYgaWQuY2hhckF0KDYpID09PSBjaDY7XG4gIH1cblxuICBzdGF0aWMgY3NlNyhpZCwgY2gxLCBjaDIsIGNoMywgY2g0LCBjaDUsIGNoNiwgY2g3KSB7XG4gICAgcmV0dXJuIGlkLmNoYXJBdCgxKSA9PT0gY2gxICYmIGlkLmNoYXJBdCgyKSA9PT0gY2gyICYmIGlkLmNoYXJBdCgzKSA9PT0gY2gzICYmIGlkLmNoYXJBdCg0KSA9PT0gY2g0ICYmIGlkLmNoYXJBdCg1KVxuICAgICAgICA9PT0gY2g1ICYmIGlkLmNoYXJBdCg2KSA9PT0gY2g2ICYmIGlkLmNoYXJBdCg3KSA9PT0gY2g3O1xuICB9XG5cbiAgc3RhdGljIGdldEtleXdvcmQoaWQsIHN0cmljdCkge1xuICAgIC8vIFwiY29uc3RcIiBpcyBzcGVjaWFsaXplZCBhcyBLZXl3b3JkIGluIFY4LlxuICAgIC8vIFwieWllbGRcIiBhbmQgXCJsZXRcIiBhcmUgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBTcGlkZXJNb25rZXkgYW5kIEVTLm5leHQuXG4gICAgLy8gU29tZSBvdGhlcnMgYXJlIGZyb20gZnV0dXJlIHJlc2VydmVkIHdvcmRzLlxuXG4gICAgaWYgKGlkLmxlbmd0aCA9PT0gMSB8fCBpZC5sZW5ndGggPiAxMCkge1xuICAgICAgcmV0dXJuIFRva2VuVHlwZS5JTExFR0FMO1xuICAgIH1cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgc3dpdGNoIChpZC5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgc3dpdGNoIChpZC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICBjYXNlIFwiaVwiOlxuICAgICAgICAgICAgc3dpdGNoIChpZC5jaGFyQXQoMSkpIHtcbiAgICAgICAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLklGO1xuICAgICAgICAgICAgICBjYXNlIFwiblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuSU47XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZFwiOlxuICAgICAgICAgICAgaWYgKGlkLmNoYXJBdCgxKSA9PT0gXCJvXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5ETztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJvXCI6XG4gICAgICAgICAgICBpZiAoaWQuY2hhckF0KDEpID09PSBcImZcIikge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLk9GO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgc3dpdGNoIChpZC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICBjYXNlIFwidlwiOlxuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2UyKGlkLCBcImFcIiwgXCJyXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuVkFSO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlMihpZCwgXCJvXCIsIFwiclwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkZPUjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJuXCI6XG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTIoaWQsIFwiZVwiLCBcIndcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5ORVc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwidFwiOlxuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2UyKGlkLCBcInJcIiwgXCJ5XCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuVFJZO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImxcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlMihpZCwgXCJlXCIsIFwidFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gVG9rZW5UeXBlLkZVVFVSRV9TVFJJQ1RfUkVTRVJWRURfV09SRCA6IFRva2VuVHlwZS5MRVQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIHN3aXRjaCAoaWQuY2hhckF0KDApKSB7XG4gICAgICAgICAgY2FzZSBcInRcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlMyhpZCwgXCJoXCIsIFwiaVwiLCBcInNcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5USElTO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChUb2tlbml6ZXIuY3NlMyhpZCwgXCJyXCIsIFwidVwiLCBcImVcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5UUlVFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIm5cIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlMyhpZCwgXCJ1XCIsIFwibFwiLCBcImxcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5OVUxMO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImVcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlMyhpZCwgXCJsXCIsIFwic1wiLCBcImVcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5FTFNFO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChUb2tlbml6ZXIuY3NlMyhpZCwgXCJuXCIsIFwidVwiLCBcIm1cIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5GVVRVUkVfUkVTRVJWRURfV09SRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJjXCI6XG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTMoaWQsIFwiYVwiLCBcInNcIiwgXCJlXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuQ0FTRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJ2XCI6XG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTMoaWQsIFwib1wiLCBcImlcIiwgXCJkXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuVk9JRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJ3XCI6XG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTMoaWQsIFwiaVwiLCBcInRcIiwgXCJoXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuV0lUSDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgc3dpdGNoIChpZC5jaGFyQXQoMCkpIHtcbiAgICAgICAgICBjYXNlIFwid1wiOiAvLyBXSElMRVxuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2U0KGlkLCBcImhcIiwgXCJpXCIsIFwibFwiLCBcImVcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5XSElMRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJiXCI6IC8vIEJSRUFLXG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTQoaWQsIFwiclwiLCBcImVcIiwgXCJhXCIsIFwia1wiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkJSRUFLO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImZcIjogLy8gRkFMU0VcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNChpZCwgXCJhXCIsIFwibFwiLCBcInNcIiwgXCJlXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuRkFMU0U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiY1wiOiAvLyBDQVRDSFxuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2U0KGlkLCBcImFcIiwgXCJ0XCIsIFwiY1wiLCBcImhcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5DQVRDSDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVG9rZW5pemVyLmNzZTQoaWQsIFwib1wiLCBcIm5cIiwgXCJzXCIsIFwidFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkNPTlNUO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChUb2tlbml6ZXIuY3NlNChpZCwgXCJsXCIsIFwiYVwiLCBcInNcIiwgXCJzXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuRlVUVVJFX1JFU0VSVkVEX1dPUkQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwidFwiOiAvLyBUSFJPV1xuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2U0KGlkLCBcImhcIiwgXCJyXCIsIFwib1wiLCBcIndcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5USFJPVztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJ5XCI6IC8vIFlJRUxEXG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTQoaWQsIFwiaVwiLCBcImVcIiwgXCJsXCIsIFwiZFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gVG9rZW5UeXBlLkZVVFVSRV9TVFJJQ1RfUkVTRVJWRURfV09SRCA6IFRva2VuVHlwZS5JTExFR0FMO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInNcIjogLy8gU1VQRVJcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNChpZCwgXCJ1XCIsIFwicFwiLCBcImVcIiwgXCJyXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuRlVUVVJFX1JFU0VSVkVEX1dPUkQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDY6XG4gICAgICAgIHN3aXRjaCAoaWQuY2hhckF0KDApKSB7XG4gICAgICAgICAgY2FzZSBcInJcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNShpZCwgXCJlXCIsIFwidFwiLCBcInVcIiwgXCJyXCIsIFwiblwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLlJFVFVSTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJ0XCI6XG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTUoaWQsIFwieVwiLCBcInBcIiwgXCJlXCIsIFwib1wiLCBcImZcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5UWVBFT0Y7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZFwiOlxuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2U1KGlkLCBcImVcIiwgXCJsXCIsIFwiZVwiLCBcInRcIiwgXCJlXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuREVMRVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInNcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNShpZCwgXCJ3XCIsIFwiaVwiLCBcInRcIiwgXCJjXCIsIFwiaFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLlNXSVRDSDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIFRva2VuaXplci5jc2U1KGlkLCBcInRcIiwgXCJhXCIsIFwidFwiLCBcImlcIiwgXCJjXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuRlVUVVJFX1NUUklDVF9SRVNFUlZFRF9XT1JEO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImVcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNShpZCwgXCJ4XCIsIFwicFwiLCBcIm9cIiwgXCJyXCIsIFwidFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkZVVFVSRV9SRVNFUlZFRF9XT1JEO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImlcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNShpZCwgXCJtXCIsIFwicFwiLCBcIm9cIiwgXCJyXCIsIFwidFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkZVVFVSRV9SRVNFUlZFRF9XT1JEO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcInBcIjpcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgVG9rZW5pemVyLmNzZTUoaWQsIFwidVwiLCBcImJcIiwgXCJsXCIsIFwiaVwiLCBcImNcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5GVVRVUkVfU1RSSUNUX1JFU0VSVkVEX1dPUkQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDc6XG4gICAgICAgIHN3aXRjaCAoaWQuY2hhckF0KDApKSB7XG4gICAgICAgICAgY2FzZSBcImRcIjogLy8gZGVmYXVsdFxuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2U2KGlkLCBcImVcIiwgXCJmXCIsIFwiYVwiLCBcInVcIiwgXCJsXCIsIFwidFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkRFRkFVTFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZlwiOiAvLyBmaW5hbGx5XG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTYoaWQsIFwiaVwiLCBcIm5cIiwgXCJhXCIsIFwibFwiLCBcImxcIiwgXCJ5XCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuRklOQUxMWTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJlXCI6IC8vIGV4dGVuZHNcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNihpZCwgXCJ4XCIsIFwidFwiLCBcImVcIiwgXCJuXCIsIFwiZFwiLCBcInNcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5GVVRVUkVfUkVTRVJWRURfV09SRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJwXCI6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgIGxldCBzID0gaWQ7XG4gICAgICAgICAgICAgIGlmIChcInByaXZhdGVcIiA9PT0gcyB8fCBcInBhY2thZ2VcIiA9PT0gcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuRlVUVVJFX1NUUklDVF9SRVNFUlZFRF9XT1JEO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDg6XG4gICAgICAgIHN3aXRjaCAoaWQuY2hhckF0KDApKSB7XG4gICAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgICAgIGlmIChUb2tlbml6ZXIuY3NlNyhpZCwgXCJ1XCIsIFwiblwiLCBcImNcIiwgXCJ0XCIsIFwiaVwiLCBcIm9cIiwgXCJuXCIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuRlVOQ1RJT047XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiY1wiOlxuICAgICAgICAgICAgaWYgKFRva2VuaXplci5jc2U3KGlkLCBcIm9cIiwgXCJuXCIsIFwidFwiLCBcImlcIiwgXCJuXCIsIFwidVwiLCBcImVcIikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5DT05USU5VRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJkXCI6XG4gICAgICAgICAgICBpZiAoVG9rZW5pemVyLmNzZTcoaWQsIFwiZVwiLCBcImJcIiwgXCJ1XCIsIFwiZ1wiLCBcImdcIiwgXCJlXCIsIFwiclwiKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkRFQlVHR0VSO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA5OlxuICAgICAgICBpZiAoc3RyaWN0ICYmIChpZC5jaGFyQXQoMCkgPT09IFwicFwiIHx8IGlkLmNoYXJBdCgwKSA9PT0gXCJpXCIpKSB7XG4gICAgICAgICAgbGV0IHMgPSBpZDtcbiAgICAgICAgICBpZiAoXCJwcm90ZWN0ZWRcIiA9PT0gcyB8fCBcImludGVyZmFjZVwiID09PSBzKSB7XG4gICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkZVVFVSRV9TVFJJQ1RfUkVTRVJWRURfV09SRDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDEwOlxuICAgICAge1xuICAgICAgICBsZXQgcyA9IGlkO1xuICAgICAgICBpZiAoXCJpbnN0YW5jZW9mXCIgPT09IHMpIHtcbiAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLklOU1RBTkNFT0Y7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RyaWN0ICYmIFwiaW1wbGVtZW50c1wiID09PSBzKSB7XG4gICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5GVVRVUkVfU1RSSUNUX1JFU0VSVkVEX1dPUkQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIFRva2VuVHlwZS5JTExFR0FMO1xuICB9XG5cbiAgc2tpcFNpbmdsZUxpbmVDb21tZW50KG9mZnNldCkge1xuICAgIHRoaXMuaW5kZXggKz0gb2Zmc2V0O1xuICAgIHdoaWxlICh0aGlzLmluZGV4IDwgdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgKi9cbiAgICAgIGxldCBjaENvZGUgPSB0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpO1xuICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgaWYgKGlzTGluZVRlcm1pbmF0b3IoY2hDb2RlKSkge1xuICAgICAgICB0aGlzLmhhc0xpbmVUZXJtaW5hdG9yQmVmb3JlTmV4dCA9IHRydWU7XG4gICAgICAgIGlmIChjaENvZGUgPT09IDB4MDAwRCAvKiBcIlxcclwiICovICYmIHRoaXMuaW5kZXggPCB0aGlzLnNvdXJjZS5sZW5ndGggJiYgdGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KVxuICAgICAgICAgICAgPT09IDB4MDAwQSAvKlwiXFxuXCIgKi8pIHtcbiAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5saW5lU3RhcnQgPSB0aGlzLmluZGV4O1xuICAgICAgICB0aGlzLmxpbmUrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNraXBNdWx0aUxpbmVDb21tZW50KCkge1xuICAgIHRoaXMuaW5kZXggKz0gMjtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLnNvdXJjZS5sZW5ndGg7XG5cbiAgICB3aGlsZSAodGhpcy5pbmRleCA8IGxlbmd0aCkge1xuICAgICAgbGV0IGNoQ29kZSA9IHRoaXMuc291cmNlLmNoYXJDb2RlQXQodGhpcy5pbmRleCk7XG4gICAgICBpZiAoY2hDb2RlIDwgMHg4MCkge1xuICAgICAgICBzd2l0Y2ggKGNoQ29kZSkge1xuICAgICAgICAgIGNhc2UgNDI6ICAvLyBcIipcIlxuICAgICAgICAgICAgLy8gQmxvY2sgY29tbWVudCBlbmRzIHdpdGggXCIqLycuXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCArIDEgPCBsZW5ndGggJiYgdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXggKyAxKSA9PT0gXCIvXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaW5kZXggKyAyO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDEwOiAgLy8gXCJcXG5cIlxuICAgICAgICAgICAgdGhpcy5oYXNMaW5lVGVybWluYXRvckJlZm9yZU5leHQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgICAgdGhpcy5saW5lU3RhcnQgPSB0aGlzLmluZGV4O1xuICAgICAgICAgICAgdGhpcy5saW5lKys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIDEzOiAvLyBcIlxcclwiOlxuICAgICAgICAgICAgdGhpcy5oYXNMaW5lVGVybWluYXRvckJlZm9yZU5leHQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCBsZW5ndGggLSAxICYmIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMSkgPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgICAgdGhpcy5saW5lU3RhcnQgPSB0aGlzLmluZGV4O1xuICAgICAgICAgICAgdGhpcy5saW5lKys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNoQ29kZSA9PT0gMHgyMDI4IHx8IGNoQ29kZSA9PT0gMHgyMDI5KSB7XG4gICAgICAgIHRoaXMuaGFzTGluZVRlcm1pbmF0b3JCZWZvcmVOZXh0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICB0aGlzLmxpbmVTdGFydCA9IHRoaXMuaW5kZXg7XG4gICAgICAgIHRoaXMubGluZSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgfVxuXG5cbiAgc2tpcENvbW1lbnQoKSB7XG4gICAgdGhpcy5oYXNMaW5lVGVybWluYXRvckJlZm9yZU5leHQgPSBmYWxzZTtcblxuICAgIGxldCBpc0xpbmVTdGFydCA9IHRoaXMuaW5kZXggPT09IDA7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuXG4gICAgd2hpbGUgKHRoaXMuaW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGxldCBjaENvZGUgPSB0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpO1xuICAgICAgaWYgKGlzV2hpdGVzcGFjZShjaENvZGUpKSB7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIH0gZWxzZSBpZiAoaXNMaW5lVGVybWluYXRvcihjaENvZGUpKSB7XG4gICAgICAgIHRoaXMuaGFzTGluZVRlcm1pbmF0b3JCZWZvcmVOZXh0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICBpZiAoY2hDb2RlID09PSAxMyAvKiBcIlxcclwiICovICYmIHRoaXMuaW5kZXggPCBsZW5ndGggJiYgdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGluZVN0YXJ0ID0gdGhpcy5pbmRleDtcbiAgICAgICAgdGhpcy5saW5lKys7XG4gICAgICAgIGlzTGluZVN0YXJ0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoY2hDb2RlID09PSA0NyAvKiBcIi9cIiAqLykge1xuICAgICAgICBpZiAodGhpcy5pbmRleCArIDEgPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2hDb2RlID0gdGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4ICsgMSk7XG4gICAgICAgIGlmIChjaENvZGUgPT09IDQ3IC8qIFwiL1wiICovKSB7XG4gICAgICAgICAgdGhpcy5za2lwU2luZ2xlTGluZUNvbW1lbnQoMik7XG4gICAgICAgICAgaXNMaW5lU3RhcnQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGNoQ29kZSA9PT0gNDIgLyogXCIqXCIgKi8pIHtcbiAgICAgICAgICB0aGlzLnNraXBNdWx0aUxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNMaW5lU3RhcnQgJiYgY2hDb2RlID09PSA0NSAvKiBcIi1cIiAqLykge1xuICAgICAgICBpZiAodGhpcy5pbmRleCArIDIgPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVSswMDNFIGlzIFwiPidcbiAgICAgICAgaWYgKCh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCArIDEpID09PSBcIi1cIikgJiYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMikgPT09IFwiPlwiKSkge1xuICAgICAgICAgIC8vIFwiLS0+XCIgaXMgYSBzaW5nbGUtbGluZSBjb21tZW50XG4gICAgICAgICAgdGhpcy5za2lwU2luZ2xlTGluZUNvbW1lbnQoMyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2hDb2RlID09PSA2MCAvKiBcIjxcIiAqLykge1xuICAgICAgICBpZiAodGhpcy5pbmRleCArIDQgPD0gbGVuZ3RoICYmIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMSkgPT09IFwiIVwiICYmIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMilcbiAgICAgICAgICAgID09PSBcIi1cIlxuICAgICAgICAgICAgJiYgdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXggKyAzKSA9PT0gXCItXCIpIHtcbiAgICAgICAgICB0aGlzLnNraXBTaW5nbGVMaW5lQ29tbWVudCg0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2NhbkhleEVzY2FwZTIoKSB7XG4gICAgaWYgKHRoaXMuaW5kZXggKyAyID4gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGxldCByMSA9IGdldEhleFZhbHVlKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KSk7XG4gICAgaWYgKHIxID09PSAtMSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBsZXQgcjIgPSBnZXRIZXhWYWx1ZSh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCArIDEpKTtcbiAgICBpZiAocjIgPT09IC0xKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIHRoaXMuaW5kZXggKz0gMjtcbiAgICByZXR1cm4gcjEgPDwgNCB8IHIyO1xuICB9XG5cbiAgc2NhblVuaWNvZGUoKSB7XG4gICAgaWYgKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KSA9PT0gXCJ7XCIpIHtcbiAgICAgIC8vXFx1e0hleERpZ2l0c31cbiAgICAgIGxldCBpID0gdGhpcy5pbmRleCArIDE7XG4gICAgICBsZXQgaGV4RGlnaXRzID0gMCwgY2g7XG4gICAgICB3aGlsZSAoaSA8IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgICBjaCA9IHRoaXMuc291cmNlLmNoYXJBdChpKTtcbiAgICAgICAgbGV0IGhleCA9IGdldEhleFZhbHVlKGNoKTtcbiAgICAgICAgaWYgKGhleCA9PT0gLTEpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBoZXhEaWdpdHMgPSAoaGV4RGlnaXRzIDw8IDQpIHwgaGV4O1xuICAgICAgICBpZiAoaGV4RGlnaXRzID4gMHgxMEZGRkYpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAoY2ggIT09IFwifVwiKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZXggPSBpICsgMTtcbiAgICAgIHJldHVybiBoZXhEaWdpdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vXFx1SGV4NERpZ2l0c1xuICAgICAgaWYgKHRoaXMuaW5kZXggKyA0ID4gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGxldCByMSA9IGdldEhleFZhbHVlKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KSk7XG4gICAgICBpZiAocjEgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGxldCByMiA9IGdldEhleFZhbHVlKHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMSkpO1xuICAgICAgaWYgKHIyID09PSAtMSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBsZXQgcjMgPSBnZXRIZXhWYWx1ZSh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCArIDIpKTtcbiAgICAgIGlmIChyMyA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgbGV0IHI0ID0gZ2V0SGV4VmFsdWUodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXggKyAzKSk7XG4gICAgICBpZiAocjQgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZXggKz0gNDtcbiAgICAgIHJldHVybiByMSA8PCAxMiB8IHIyIDw8IDggfCByMyA8PCA0IHwgcjQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0RXNjYXBlZElkZW50aWZpZXIoKSB7XG4gICAgbGV0IGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgIHRoaXMuaW5kZXgrKztcbiAgICBpZiAodGhpcy5pbmRleCA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgIH1cblxuICAgIGxldCBpZCA9IFwiXCI7XG5cbiAgICBpZiAoY2ggPT09IFwiXFxcXFwiKSB7XG4gICAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpICE9PSBcInVcIikge1xuICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICAgIH1cbiAgICAgIGxldCBpY2ggPSB0aGlzLnNjYW5Vbmljb2RlKCk7XG4gICAgICBpZiAoaWNoIDwgMCB8fCBpY2ggPT09IDB4MDA1QyAvKiBcIlxcXFxcIiAqLyAgfHwgIWlzSWRlbnRpZmllclN0YXJ0KGljaCkpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gICAgICB9XG4gICAgICBjaCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaWNoKTtcbiAgICB9XG4gICAgaWQgKz0gY2g7XG5cbiAgICB3aGlsZSAodGhpcy5pbmRleCA8IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgY2ggPSB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCk7XG4gICAgICBpZiAoIWlzSWRlbnRpZmllclBhcnQoY2guY2hhckNvZGVBdCgwKSkgJiYgY2ggIT09IFwiXFxcXFwiKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgaWYgKGNoID09PSBcIlxcXFxcIikge1xuICAgICAgICBpZiAodGhpcy5pbmRleCA+PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpICE9PSBcInVcIikge1xuICAgICAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPj0gdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGljaCA9IHRoaXMuc2NhblVuaWNvZGUoKTtcbiAgICAgICAgaWYgKGljaCA8IDAgfHwgaWNoID09PSAweDAwNUMgLyogXCJcXFxcXCIgKi8gfHwgIWlzSWRlbnRpZmllclBhcnQoaWNoKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgICAgICB9XG4gICAgICAgIGNoID0gU3RyaW5nLmZyb21DaGFyQ29kZShpY2gpO1xuICAgICAgfVxuICAgICAgaWQgKz0gY2g7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgZ2V0SWRlbnRpZmllcigpIHtcbiAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4O1xuICAgIHRoaXMuaW5kZXgrKztcbiAgICBsZXQgbCA9IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgICBsZXQgaSA9IHRoaXMuaW5kZXg7XG4gICAgd2hpbGUgKGkgPCBsKSB7XG4gICAgICBsZXQgY2ggPSB0aGlzLnNvdXJjZS5jaGFyQXQoaSk7XG4gICAgICBpZiAoY2ggPT09IFwiXFxcXFwiKSB7XG4gICAgICAgIC8vIEdvIGJhY2sgYW5kIHRyeSB0aGUgaGFyZCBvbmUuXG4gICAgICAgIHRoaXMuaW5kZXggPSBzdGFydDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RXNjYXBlZElkZW50aWZpZXIoKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNJZGVudGlmaWVyUGFydChjaC5jaGFyQ29kZUF0KDApKSkge1xuICAgICAgICBpKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pbmRleCA9IGk7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmluZGV4KTtcbiAgfVxuXG4gIHNjYW5JZGVudGlmaWVyKCkge1xuICAgIGxldCBzdGFydExvY2F0aW9uID0gdGhpcy5nZXRMb2NhdGlvbigpO1xuICAgIGxldCBzdGFydCA9IHRoaXMuaW5kZXg7XG5cbiAgICAvLyBCYWNrc2xhc2ggKFUrMDA1Qykgc3RhcnRzIGFuIGVzY2FwZWQgY2hhcmFjdGVyLlxuICAgIGxldCBpZCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KSA9PT0gXCJcXFxcXCIgPyB0aGlzLmdldEVzY2FwZWRJZGVudGlmaWVyKCkgOiB0aGlzLmdldElkZW50aWZpZXIoKTtcblxuICAgIC8vIFRoZXJlIGlzIG5vIGtleXdvcmQgb3IgbGl0ZXJhbCB3aXRoIG9ubHkgb25lIGNoYXJhY3Rlci5cbiAgICAvLyBUaHVzLCBpdCBtdXN0IGJlIGFuIGlkZW50aWZpZXIuXG4gICAgbGV0IHNsaWNlID0gdGhpcy5nZXRTbGljZShzdGFydCwgc3RhcnRMb2NhdGlvbik7XG4gICAgc2xpY2UudGV4dCA9IGlkO1xuXG4gICAgaWYgKChpZC5sZW5ndGggPT09IDEpKSB7XG4gICAgICByZXR1cm4gbmV3IElkZW50aWZpZXJUb2tlbihzbGljZSk7XG4gICAgfVxuXG4gICAgbGV0IHN1YlR5cGUgPSBUb2tlbml6ZXIuZ2V0S2V5d29yZChpZCwgdGhpcy5zdHJpY3QpO1xuICAgIGlmIChzdWJUeXBlICE9PSBUb2tlblR5cGUuSUxMRUdBTCkge1xuICAgICAgcmV0dXJuIG5ldyBLZXl3b3JkVG9rZW4oc3ViVHlwZSwgc2xpY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSWRlbnRpZmllclRva2VuKHNsaWNlKTtcbiAgfVxuXG4gIGdldExvY2F0aW9uKCkge1xuICAgIHJldHVybiBuZXcgU2hpZnQuU291cmNlTG9jYXRpb24odGhpcy5zdGFydEluZGV4LCB0aGlzLnN0YXJ0TGluZSArIDEsIHRoaXMuc3RhcnRJbmRleCAtIHRoaXMuc3RhcnRMaW5lU3RhcnQpO1xuICB9XG5cbiAgZ2V0U2xpY2Uoc3RhcnQsIHN0YXJ0TG9jYXRpb24pIHtcbiAgICByZXR1cm4ge3RleHQ6IHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0LCB0aGlzLmluZGV4KSwgc3RhcnQsIHN0YXJ0TG9jYXRpb24sIGVuZDogdGhpcy5pbmRleH07XG4gIH1cblxuICBzY2FuUHVuY3R1YXRvckhlbHBlcigpIHtcbiAgICBsZXQgY2gxID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuXG4gICAgc3dpdGNoIChjaDEpIHtcbiAgICAgIC8vIENoZWNrIGZvciBtb3N0IGNvbW1vbiBzaW5nbGUtY2hhcmFjdGVyIHB1bmN0dWF0b3JzLlxuICAgICAgY2FzZSBcIi5cIjpcbiAgICAgICAgbGV0IGNoMiA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMSk7XG4gICAgICAgIGlmIChjaDIgIT09IFwiLlwiKSByZXR1cm4gVG9rZW5UeXBlLlBFUklPRDtcbiAgICAgICAgbGV0IGNoMyA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMik7XG4gICAgICAgIGlmIChjaDMgIT09IFwiLlwiKSByZXR1cm4gVG9rZW5UeXBlLlBFUklPRDtcbiAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5FTExJUFNJUztcbiAgICAgIGNhc2UgXCIoXCI6XG4gICAgICAgIHJldHVybiBUb2tlblR5cGUuTFBBUkVOO1xuICAgICAgY2FzZSBcIilcIjpcbiAgICAgIGNhc2UgXCI7XCI6XG4gICAgICBjYXNlIFwiLFwiOlxuICAgICAgICByZXR1cm4gT05FX0NIQVJfUFVOQ1RVQVRPUltjaDEuY2hhckNvZGVBdCgwKV07XG4gICAgICBjYXNlIFwie1wiOlxuICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkxCUkFDRTtcbiAgICAgIGNhc2UgXCJ9XCI6XG4gICAgICBjYXNlIFwiW1wiOlxuICAgICAgY2FzZSBcIl1cIjpcbiAgICAgIGNhc2UgXCI6XCI6XG4gICAgICBjYXNlIFwiP1wiOlxuICAgICAgY2FzZSBcIn5cIjpcbiAgICAgICAgcmV0dXJuIE9ORV9DSEFSX1BVTkNUVUFUT1JbY2gxLmNoYXJDb2RlQXQoMCldO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gXCI9XCIgKFUrMDAzRCkgbWFya3MgYW4gYXNzaWdubWVudCBvciBjb21wYXJpc29uIG9wZXJhdG9yLlxuICAgICAgICBpZiAodGhpcy5pbmRleCArIDEgPCB0aGlzLnNvdXJjZS5sZW5ndGggJiYgdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXggKyAxKSA9PT0gXCI9XCIpIHtcbiAgICAgICAgICBzd2l0Y2ggKGNoMSkge1xuICAgICAgICAgICAgY2FzZSBcIj1cIjpcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggKyAyIDwgdGhpcy5zb3VyY2UubGVuZ3RoICYmIHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4ICsgMikgPT09IFwiPVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5FUV9TVFJJQ1Q7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5FUTtcbiAgICAgICAgICAgIGNhc2UgXCIhXCI6XG4gICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ICsgMiA8IHRoaXMuc291cmNlLmxlbmd0aCAmJiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCArIDIpID09PSBcIj1cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuTkVfU1RSSUNUO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuTkU7XG4gICAgICAgICAgICBjYXNlIFwifFwiOlxuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkFTU0lHTl9CSVRfT1I7XG4gICAgICAgICAgICBjYXNlIFwiK1wiOlxuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkFTU0lHTl9BREQ7XG4gICAgICAgICAgICBjYXNlIFwiLVwiOlxuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkFTU0lHTl9TVUI7XG4gICAgICAgICAgICBjYXNlIFwiKlwiOlxuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkFTU0lHTl9NVUw7XG4gICAgICAgICAgICBjYXNlIFwiPFwiOlxuICAgICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkxURTtcbiAgICAgICAgICAgIGNhc2UgXCI+XCI6XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuR1RFO1xuICAgICAgICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5BU1NJR05fRElWO1xuICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5BU1NJR05fTU9EO1xuICAgICAgICAgICAgY2FzZSBcIl5cIjpcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5BU1NJR05fQklUX1hPUjtcbiAgICAgICAgICAgIGNhc2UgXCImXCI6XG4gICAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuQVNTSUdOX0JJVF9BTkQ7XG4gICAgICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWs7IC8vZmFpbGVkXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5kZXggKyAxIDwgdGhpcy5zb3VyY2UubGVuZ3RoKSB7XG4gICAgICBsZXQgY2gyID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXggKyAxKTtcbiAgICAgIGlmIChjaDEgPT09IGNoMikge1xuICAgICAgICBpZiAodGhpcy5pbmRleCArIDIgPCB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgY2gzID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXggKyAyKTtcbiAgICAgICAgICBpZiAoY2gxID09PSBcIj5cIiAmJiBjaDMgPT09IFwiPlwiKSB7XG4gICAgICAgICAgICAvLyA0LWNoYXJhY3RlciBwdW5jdHVhdG9yOiA+Pj49XG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCArIDMgPCB0aGlzLnNvdXJjZS5sZW5ndGggJiYgdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXggKyAzKSA9PT0gXCI9XCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5BU1NJR05fU0hSX1VOU0lHTkVEO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5TSFJfVU5TSUdORUQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNoMSA9PT0gXCI8XCIgJiYgY2gzID09PSBcIj1cIikge1xuICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5BU1NJR05fU0hMO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjaDEgPT09IFwiPlwiICYmIGNoMyA9PT0gXCI9XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuQVNTSUdOX1NIUjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gT3RoZXIgMi1jaGFyYWN0ZXIgcHVuY3R1YXRvcnM6ICsrIC0tIDw8ID4+ICYmIHx8XG4gICAgICAgIHN3aXRjaCAoY2gxKSB7XG4gICAgICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuSU5DO1xuICAgICAgICAgIGNhc2UgXCItXCI6XG4gICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkRFQztcbiAgICAgICAgICBjYXNlIFwiPFwiOlxuICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5TSEw7XG4gICAgICAgICAgY2FzZSBcIj5cIjpcbiAgICAgICAgICAgIHJldHVybiBUb2tlblR5cGUuU0hSO1xuICAgICAgICAgIGNhc2UgXCImXCI6XG4gICAgICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkFORDtcbiAgICAgICAgICBjYXNlIFwifFwiOlxuICAgICAgICAgICAgcmV0dXJuIFRva2VuVHlwZS5PUjtcbiAgICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhazsgLy9mYWlsZWRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChjaDEgPT09ICc9JyAmJiBjaDIgPT09ICc+Jykge1xuICAgICAgICByZXR1cm4gVG9rZW5UeXBlLkFSUk9XO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBPTkVfQ0hBUl9QVU5DVFVBVE9SW2NoMS5jaGFyQ29kZUF0KDApXTtcbiAgfVxuXG4gIC8vIDcuNyBQdW5jdHVhdG9yc1xuICBzY2FuUHVuY3R1YXRvcigpIHtcbiAgICBsZXQgc3RhcnRMb2NhdGlvbiA9IHRoaXMuZ2V0TG9jYXRpb24oKTtcbiAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4O1xuICAgIGxldCBzdWJUeXBlID0gdGhpcy5zY2FuUHVuY3R1YXRvckhlbHBlcigpO1xuICAgIHRoaXMuaW5kZXggKz0gc3ViVHlwZS5uYW1lLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IFB1bmN0dWF0b3JUb2tlbihzdWJUeXBlLCB0aGlzLmdldFNsaWNlKHN0YXJ0LCBzdGFydExvY2F0aW9uKSk7XG4gIH1cblxuICBzY2FuSGV4TGl0ZXJhbChzdGFydCwgc3RhcnRMb2NhdGlvbikge1xuICAgIGxldCBpID0gdGhpcy5pbmRleDtcbiAgICB3aGlsZSAoaSA8IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgbGV0IGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KGkpO1xuICAgICAgbGV0IGhleCA9IGdldEhleFZhbHVlKGNoKTtcbiAgICAgIGlmIChoZXggPT09IC0xKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluZGV4ID09PSBpKSB7XG4gICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICB9XG5cbiAgICBpZiAoaSA8IHRoaXMuc291cmNlLmxlbmd0aCAmJiBpc0lkZW50aWZpZXJTdGFydCh0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KGkpKSkge1xuICAgICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmRleCA9IGk7XG5cbiAgICBsZXQgc2xpY2UgPSB0aGlzLmdldFNsaWNlKHN0YXJ0LCBzdGFydExvY2F0aW9uKTtcbiAgICByZXR1cm4gbmV3IE51bWVyaWNMaXRlcmFsVG9rZW4oc2xpY2UsIHBhcnNlSW50KHNsaWNlLnRleHQuc3Vic3RyKDIpLCAxNikpO1xuICB9XG5cbiAgc2NhbkJpbmFyeUxpdGVyYWwoc3RhcnQsIHN0YXJ0TG9jYXRpb24pIHtcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5pbmRleCAtIHN0YXJ0O1xuXG4gICAgd2hpbGUgKHRoaXMuaW5kZXggPCB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIGxldCBjaCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcbiAgICAgIGlmIChjaCAhPT0gXCIwXCIgJiYgY2ggIT09IFwiMVwiKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRleCsrO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluZGV4IC0gc3RhcnQgPD0gb2Zmc2V0KSB7XG4gICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuc291cmNlLmxlbmd0aCAmJiAoaXNJZGVudGlmaWVyU3RhcnQodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KSlcbiAgICAgICAgfHwgaXNEZWNpbWFsRGlnaXQodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpKSkpIHtcbiAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTnVtZXJpY0xpdGVyYWxUb2tlbih0aGlzLmdldFNsaWNlKHN0YXJ0LCBzdGFydExvY2F0aW9uKSwgcGFyc2VJbnQodGhpcy5nZXRTbGljZShzdGFydCwgc3RhcnRMb2NhdGlvbikudGV4dC5zdWJzdHIob2Zmc2V0KSwgMiksIHRydWUpO1xuICB9XG5cbiAgc2Nhbk9jdGFsTGl0ZXJhbChzdGFydCwgc3RhcnRMb2NhdGlvbikge1xuICAgIHZhciBvZmZzZXQgPSB0aGlzLmluZGV4IC0gc3RhcnQ7XG5cbiAgICB3aGlsZSAodGhpcy5pbmRleCA8IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgbGV0IGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgICAgaWYgKCEoXCIwXCIgPD0gY2ggJiYgY2ggPD0gXCI3XCIpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRleCsrO1xuICAgIH1cblxuICAgIGlmIChvZmZzZXQgPT09IDIgJiYgdGhpcy5pbmRleCAtIHN0YXJ0ID09PSAyKSB7XG4gICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuc291cmNlLmxlbmd0aCAmJiAoaXNJZGVudGlmaWVyU3RhcnQodGhpcy5zb3VyY2UuY2hhckNvZGVBdCh0aGlzLmluZGV4KSlcbiAgICAgICAgfHwgaXNEZWNpbWFsRGlnaXQodGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpKSkpIHtcbiAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTnVtZXJpY0xpdGVyYWxUb2tlbih0aGlzLmdldFNsaWNlKHN0YXJ0LCBzdGFydExvY2F0aW9uKSwgcGFyc2VJbnQodGhpcy5nZXRTbGljZShzdGFydCwgc3RhcnRMb2NhdGlvbikudGV4dC5zdWJzdHIob2Zmc2V0KSwgOCksIHRydWUpO1xuICB9XG5cbiAgc2Nhbk51bWVyaWNMaXRlcmFsKCkge1xuICAgIGxldCBjaCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcbiAgICAvLyBhc3NlcnQoY2ggPT09IFwiLlwiIHx8IFwiMFwiIDw9IGNoICYmIGNoIDw9IFwiOVwiKVxuICAgIGxldCBzdGFydExvY2F0aW9uID0gdGhpcy5nZXRMb2NhdGlvbigpO1xuICAgIGxldCBzdGFydCA9IHRoaXMuaW5kZXg7XG5cbiAgICBpZiAoY2ggPT09IFwiMFwiKSB7XG4gICAgICB0aGlzLmluZGV4Kys7XG4gICAgICBpZiAodGhpcy5pbmRleCA8IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgICBjaCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcbiAgICAgICAgaWYgKGNoID09PSBcInhcIiB8fCBjaCA9PT0gXCJYXCIpIHtcbiAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkhleExpdGVyYWwoc3RhcnQsIHN0YXJ0TG9jYXRpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcImJcIiB8fCBjaCA9PT0gXCJCXCIpIHtcbiAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkJpbmFyeUxpdGVyYWwoc3RhcnQsIHN0YXJ0TG9jYXRpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIm9cIiB8fCBjaCA9PT0gXCJPXCIpIHtcbiAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2Nhbk9jdGFsTGl0ZXJhbChzdGFydCwgc3RhcnRMb2NhdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAoXCIwXCIgPD0gY2ggJiYgY2ggPD0gXCI5XCIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zY2FuT2N0YWxMaXRlcmFsKHN0YXJ0LCBzdGFydExvY2F0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1lcmljTGl0ZXJhbFRva2VuKHRoaXMuZ2V0U2xpY2Uoc3RhcnQsIHN0YXJ0TG9jYXRpb24pKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoICE9PSBcIi5cIikge1xuICAgICAgLy8gTXVzdCBiZSBcIjEnLi4nOSdcbiAgICAgIGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgICAgd2hpbGUgKFwiMFwiIDw9IGNoICYmIGNoIDw9IFwiOVwiKSB7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiBuZXcgTnVtZXJpY0xpdGVyYWxUb2tlbih0aGlzLmdldFNsaWNlKHN0YXJ0LCBzdGFydExvY2F0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2ggPSB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGUgPSAwO1xuICAgIGlmIChjaCA9PT0gXCIuXCIpIHtcbiAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1lcmljTGl0ZXJhbFRva2VuKHRoaXMuZ2V0U2xpY2Uoc3RhcnQsIHN0YXJ0TG9jYXRpb24pKTtcbiAgICAgIH1cblxuICAgICAgY2ggPSB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCk7XG4gICAgICB3aGlsZSAoXCIwXCIgPD0gY2ggJiYgY2ggPD0gXCI5XCIpIHtcbiAgICAgICAgZSsrO1xuICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IE51bWVyaWNMaXRlcmFsVG9rZW4odGhpcy5nZXRTbGljZShzdGFydCwgc3RhcnRMb2NhdGlvbikpO1xuICAgICAgICB9XG4gICAgICAgIGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVPRiBub3QgcmVhY2hlZCBoZXJlXG4gICAgaWYgKGNoID09PSBcImVcIiB8fCBjaCA9PT0gXCJFXCIpIHtcbiAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gICAgICB9XG5cbiAgICAgIGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgICAgbGV0IG5lZyA9IGZhbHNlO1xuICAgICAgaWYgKGNoID09PSBcIitcIiB8fCBjaCA9PT0gXCItXCIpIHtcbiAgICAgICAgbmVnID0gY2ggPT09IFwiLVwiO1xuICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgICAgICAgfVxuICAgICAgICBjaCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcbiAgICAgIH1cblxuICAgICAgbGV0IGYgPSAwO1xuICAgICAgaWYgKFwiMFwiIDw9IGNoICYmIGNoIDw9IFwiOVwiKSB7XG4gICAgICAgIHdoaWxlIChcIjBcIiA8PSBjaCAmJiBjaCA8PSBcIjlcIikge1xuICAgICAgICAgIGYgKj0gMTA7XG4gICAgICAgICAgZiArPSArY2g7XG4gICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gICAgICB9XG4gICAgICBlICs9IG5lZyA/IGYgOiAtZjtcbiAgICB9XG5cbiAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTnVtZXJpY0xpdGVyYWxUb2tlbih0aGlzLmdldFNsaWNlKHN0YXJ0LCBzdGFydExvY2F0aW9uKSk7XG4gIH1cblxuICAvLyA3LjguNCBTdHJpbmcgTGl0ZXJhbHNcbiAgc2NhblN0cmluZ0xpdGVyYWwoKSB7XG4gICAgbGV0IHN0ciA9IFwiXCI7XG5cbiAgICBsZXQgcXVvdGUgPSB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCk7XG4gICAgLy8gIGFzc2VydCgocXVvdGUgPT09IFwiXFxcIlwiIHx8IHF1b3RlID09PSBcIlwiXCIpLCBcIlN0cmluZyBsaXRlcmFsIG11c3Qgc3RhcnRzIHdpdGggYSBxdW90ZVwiKVxuXG4gICAgbGV0IHN0YXJ0TG9jYXRpb24gPSB0aGlzLmdldExvY2F0aW9uKCk7XG4gICAgbGV0IHN0YXJ0ID0gdGhpcy5pbmRleDtcbiAgICB0aGlzLmluZGV4Kys7XG5cbiAgICBsZXQgb2N0YWwgPSBmYWxzZTtcbiAgICB3aGlsZSAodGhpcy5pbmRleCA8IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgbGV0IGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgICAgaWYgKGNoID09PSBxdW90ZSkge1xuICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgIHJldHVybiBuZXcgU3RyaW5nTGl0ZXJhbFRva2VuKHRoaXMuZ2V0U2xpY2Uoc3RhcnQsIHN0YXJ0TG9jYXRpb24pLCBzdHIsIG9jdGFsKTtcbiAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXFxcXFwiKSB7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgICAgICB9XG4gICAgICAgIGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgICAgICBpZiAoIWlzTGluZVRlcm1pbmF0b3IoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgICAgICBjYXNlIFwiblwiOlxuICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIjtcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyXCI6XG4gICAgICAgICAgICAgIHN0ciArPSBcIlxcclwiO1xuICAgICAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInRcIjpcbiAgICAgICAgICAgICAgc3RyICs9IFwiXFx0XCI7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidVwiOlxuICAgICAgICAgICAgY2FzZSBcInhcIjpcbiAgICAgICAgICAgICAgbGV0IHJlc3RvcmUgPSB0aGlzLmluZGV4O1xuICAgICAgICAgICAgICBsZXQgdW5lc2NhcGVkO1xuICAgICAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHVuZXNjYXBlZCA9IGNoID09PSBcInVcIiA/IHRoaXMuc2NhblVuaWNvZGUoKSA6IHRoaXMuc2NhbkhleEVzY2FwZTIoKTtcbiAgICAgICAgICAgICAgaWYgKHVuZXNjYXBlZCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodW5lc2NhcGVkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gcmVzdG9yZTtcbiAgICAgICAgICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImJcIjpcbiAgICAgICAgICAgICAgc3RyICs9IFwiXFxiXCI7XG4gICAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiZlwiOlxuICAgICAgICAgICAgICBzdHIgKz0gXCJcXGZcIjtcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ2XCI6XG4gICAgICAgICAgICAgIHN0ciArPSBcIlxcdTAwMEJcIjtcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGlmIChcIjBcIiA8PSBjaCAmJiBjaCA8PSBcIjdcIikge1xuICAgICAgICAgICAgICAgIG9jdGFsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgb2N0TGVuID0gMTtcbiAgICAgICAgICAgICAgICAvLyAzIGRpZ2l0cyBhcmUgb25seSBhbGxvd2VkIHdoZW4gc3RyaW5nIHN0YXJ0c1xuICAgICAgICAgICAgICAgIC8vIHdpdGggMCwgMSwgMiwgM1xuICAgICAgICAgICAgICAgIGlmIChcIjBcIiA8PSBjaCAmJiBjaCA8PSBcIjNcIikge1xuICAgICAgICAgICAgICAgICAgb2N0TGVuID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGNvZGUgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlIChvY3RMZW4gPCAzICYmIFwiMFwiIDw9IGNoICYmIGNoIDw9IFwiN1wiKSB7XG4gICAgICAgICAgICAgICAgICBjb2RlICo9IDg7XG4gICAgICAgICAgICAgICAgICBvY3RMZW4rKztcbiAgICAgICAgICAgICAgICAgIGNvZGUgKz0gY2ggLSBcIjBcIjtcbiAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ID09PSB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjaCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyICs9IGNoO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmhhc0xpbmVUZXJtaW5hdG9yQmVmb3JlTmV4dCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgICAgIGlmIChjaCA9PT0gXCJcXHJcIiAmJiB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCkgPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5saW5lU3RhcnQgPSB0aGlzLmluZGV4O1xuICAgICAgICAgIHRoaXMubGluZSsrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzTGluZVRlcm1pbmF0b3IoY2guY2hhckNvZGVBdCgwKSkpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVJTExFR0FMKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyB0aGlzLmNyZWF0ZUlMTEVHQUwoKTtcbiAgfVxuXG4gIHNjYW5SZWdFeHAoc3RyKSB7XG5cbiAgICBsZXQgc3RhcnRMb2NhdGlvbiA9IHRoaXMuZ2V0TG9jYXRpb24oKTtcbiAgICBsZXQgc3RhcnQgPSB0aGlzLmluZGV4O1xuXG4gICAgbGV0IHRlcm1pbmF0ZWQgPSBmYWxzZTtcbiAgICBsZXQgY2xhc3NNYXJrZXIgPSBmYWxzZTtcbiAgICB3aGlsZSAodGhpcy5pbmRleCA8IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgbGV0IGNoID0gdGhpcy5zb3VyY2UuY2hhckF0KHRoaXMuaW5kZXgpO1xuICAgICAgaWYgKGNoID09PSBcIlxcXFxcIikge1xuICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgICAgY2ggPSB0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCk7XG4gICAgICAgIC8vIEVDTUEtMjYyIDcuOC41XG4gICAgICAgIGlmIChpc0xpbmVUZXJtaW5hdG9yKGNoLmNoYXJDb2RlQXQoMCkpKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5jcmVhdGVFcnJvcihFcnJvck1lc3NhZ2VzLlVOVEVSTUlOQVRFRF9SRUdfRVhQKTtcbiAgICAgICAgfVxuICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIH0gZWxzZSBpZiAoaXNMaW5lVGVybWluYXRvcihjaC5jaGFyQ29kZUF0KDApKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmNyZWF0ZUVycm9yKEVycm9yTWVzc2FnZXMuVU5URVJNSU5BVEVEX1JFR19FWFApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNsYXNzTWFya2VyKSB7XG4gICAgICAgICAgaWYgKGNoID09PSBcIl1cIikge1xuICAgICAgICAgICAgY2xhc3NNYXJrZXIgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGNoID09PSBcIi9cIikge1xuICAgICAgICAgICAgdGVybWluYXRlZCA9IHRydWU7XG4gICAgICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgICAgICB0aGlzLmluZGV4Kys7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBcIltcIikge1xuICAgICAgICAgICAgY2xhc3NNYXJrZXIgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRlcm1pbmF0ZWQpIHtcbiAgICAgIHRocm93IHRoaXMuY3JlYXRlRXJyb3IoRXJyb3JNZXNzYWdlcy5VTlRFUk1JTkFURURfUkVHX0VYUCk7XG4gICAgfVxuXG4gICAgd2hpbGUgKHRoaXMuaW5kZXggPCB0aGlzLnNvdXJjZS5sZW5ndGgpIHtcbiAgICAgIGxldCBjaCA9IHRoaXMuc291cmNlLmNoYXJBdCh0aGlzLmluZGV4KTtcbiAgICAgIGlmICghaXNJZGVudGlmaWVyUGFydChjaC5jaGFyQ29kZUF0KDApKSAmJiBjaCAhPT0gXCJcXFxcXCIpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB0aGlzLmluZGV4Kys7XG4gICAgICBzdHIgKz0gY2g7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmVndWxhckV4cHJlc3Npb25MaXRlcmFsVG9rZW4odGhpcy5nZXRTbGljZShzdGFydCwgc3RhcnRMb2NhdGlvbiksIHN0cik7XG4gIH1cblxuICBhZHZhbmNlKCkge1xuICAgIGxldCBzdGFydExvY2F0aW9uID0gdGhpcy5nZXRMb2NhdGlvbigpO1xuXG4gICAgdGhpcy5sYXN0SW5kZXggPSB0aGlzLmluZGV4O1xuICAgIHRoaXMubGFzdExpbmUgPSB0aGlzLmxpbmU7XG4gICAgdGhpcy5sYXN0TGluZVN0YXJ0ID0gdGhpcy5saW5lU3RhcnQ7XG5cbiAgICB0aGlzLnNraXBDb21tZW50KCk7XG5cbiAgICB0aGlzLnN0YXJ0SW5kZXggPSB0aGlzLmluZGV4O1xuICAgIHRoaXMuc3RhcnRMaW5lID0gdGhpcy5saW5lO1xuICAgIHRoaXMuc3RhcnRMaW5lU3RhcnQgPSB0aGlzLmxpbmVTdGFydDtcblxuICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMuc291cmNlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5ldyBFT0ZUb2tlbih0aGlzLmdldFNsaWNlKHRoaXMuaW5kZXgsIHN0YXJ0TG9jYXRpb24pKTtcbiAgICB9XG5cbiAgICBsZXQgY2hhckNvZGUgPSB0aGlzLnNvdXJjZS5jaGFyQ29kZUF0KHRoaXMuaW5kZXgpO1xuXG4gICAgaWYgKGNoYXJDb2RlIDwgMHg4MCkge1xuICAgICAgaWYgKFBVTkNUVUFUT1JfU1RBUlRbY2hhckNvZGVdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5QdW5jdHVhdG9yKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChJREVOVElGSUVSX1NUQVJUW2NoYXJDb2RlXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY2FuSWRlbnRpZmllcigpO1xuICAgICAgfVxuXG4gICAgICAvLyBEb3QgKC4pIFUrMDAyRSBjYW4gYWxzbyBzdGFydCBhIGZsb2F0aW5nLXBvbGV0IG51bWJlciwgaGVuY2UgdGhlIG5lZWRcbiAgICAgIC8vIHRvIGNoZWNrIHRoZSBuZXh0IGNoYXJhY3Rlci5cbiAgICAgIGlmIChjaGFyQ29kZSA9PT0gMHgwMDJFKSB7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ICsgMSA8IHRoaXMuc291cmNlLmxlbmd0aCAmJiBpc0RlY2ltYWxEaWdpdCh0aGlzLnNvdXJjZS5jaGFyQXQodGhpcy5pbmRleCArIDEpKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNjYW5OdW1lcmljTGl0ZXJhbCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5QdW5jdHVhdG9yKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFN0cmluZyBsaXRlcmFsIHN0YXJ0cyB3aXRoIHNpbmdsZSBxdW90ZSAoVSswMDI3KSBvciBkb3VibGUgcXVvdGUgKFUrMDAyMikuXG4gICAgICBpZiAoY2hhckNvZGUgPT09IDB4MDAyNyB8fCBjaGFyQ29kZSA9PT0gMHgwMDIyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5TdHJpbmdMaXRlcmFsKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgweDAwMzAgLyogJzAnICovIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IDB4MDAzOSAvKiAnOScgKi8pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nhbk51bWVyaWNMaXRlcmFsKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNsYXNoICgvKSBVKzAwMkYgY2FuIGFsc28gc3RhcnQgYSByZWdleC5cbiAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQoY2hhckNvZGUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5JZGVudGlmaWVyKCk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IHRoaXMuY3JlYXRlSUxMRUdBTCgpO1xuICAgIH1cbiAgfVxuXG4gIGVvZigpIHtcbiAgICByZXR1cm4gdGhpcy5sb29rYWhlYWQudHlwZSA9PT0gVG9rZW5UeXBlLkVPUztcbiAgfVxuXG4gIGxleCgpIHtcbiAgICB0aGlzLnByZXZUb2tlbiA9IHRoaXMubG9va2FoZWFkO1xuICAgIHRoaXMubG9va2FoZWFkID0gdGhpcy5hZHZhbmNlKCk7XG4gICAgdGhpcy50b2tlbkluZGV4Kys7XG4gICAgcmV0dXJuIHRoaXMucHJldlRva2VuO1xuICB9XG59XG4iXX0=