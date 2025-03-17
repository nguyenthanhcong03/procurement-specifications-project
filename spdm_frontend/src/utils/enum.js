export const RolesEnums = {
    ADMIN: 'ADMIN',             // Admin role
    USER: 'USER',               // User role
};
/*
Type of node
- Label2
- Label3
*/
export const TYPE_NODE = Object.freeze({
    Label1: {name: 'Label1', color: "#cff6f9"},
    Label2: {name: 'Label2', color: "#cefec9"},
    Label3: {name: 'Label3', color: "#f6d1ef"},
    Label4: {name: 'Label4', color: "#fff3cd"},
    Sublabel: {name: 'Sublabel', color: "#fff3cd"}
});

/*
- TYPE 1: link node in same process
- TYPE 2:
- TYPE 3:
- TYPE 0
 */
export const TYPE_EDGES = Object.freeze({
    TYPE1: 'Type1',
    TYPE2: 'Type2',
    TYPE3: 'Type3',
    TYPE0: 'Type0',
});
export const TYPE_FIELD = {
    INPUT_SEARCH: "search",
    DATE: "date",
    INPUT: "text",
    PASSWORD: "password",
    RADIO: "radio",
    CHECKBOX: "checkbox",
};
