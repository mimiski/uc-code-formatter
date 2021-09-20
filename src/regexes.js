module.exports = {
  classDefinition: "class.*(extends)(.|\n|\r)*;",
  loopHeader: "for[ | \t]*\([ | \t]*([a-zA-Z0-9]*)[ | \t]*([=])[ | \t]*([a-zA-Z0-9]*)[ | \t]*;[ | \t]*([a-zA-Z0-9]*)[ | \t]*([<=|==|>=|<|>]*)[ | \t]*([a-zA-Z0-9]*)[ | \t]*;[ | \t]*([a-zA-Z0-9+-=]*)[ | \t]*\)"
}