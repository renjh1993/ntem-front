const base_property = {
    label: { isDefault: false, value: '' },
    type: { isDefault: true, value: '' },
    x: { isDefault: '', value: '' },
    y: { isDefault: '', value: '' },
    id: { isDefault: '', value: '' }
}
const nodeproperty = function(type) {
    var pty = {}
    switch (type) {
        case 'start':
            {
                pty = {
                    base: {
                        type: { isDefault: true, value: type }
                    },
                    input: {},
                    output: {}
                }
                break
            }
        case 'end':
            {
                pty = {
                    base: {
                        type: { isDefault: true, value: type }
                    },
                    input: {},
                    output: {}
                }
                break
            }
        case 'decision':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'fork':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type },
                        IS_ASYN: { isDefault: '', value: '' }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'join':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'sloop':
            {
                pty = {
                    base: {
                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'eloop':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'lstransition':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'letransition':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'gstransition':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'getransition':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'selfcmp':
            {
                pty = {
                    base: {

                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        case 'subcmp':
            {
                pty = {
                    base: {
                        type: { isDefault: true, value: type }
                    },
                    input: {
                        condition: { isDefault: '', value: '' }
                    },
                    output: {
                        condition: { isDefault: '', value: '' }
                    }
                }
                break
            }
        default:
            break
    }
    return pty
}
const Menu = {

}
module.exports = [{
        url: '/dmip_flow/node/getProperty',
        type: 'get',
        response: config => {
            var res = nodeproperty(config.query.type);
            res.base = Object.assign({}, base_property, res.base);
            return {
                code: 200,
                data: res
            }
        }
    },
    {
        url: '/dmip_flow/node/setProperty',
        type: 'post',
        response: config => {
            return {
                code: 200
            }
        }
    },
    {
        url: '/dmip_flow/node/getMenuList',
        type: 'get',
        response: config => {
            return {
                code: 200,
                data: Menu
            }
        }
    }
]
