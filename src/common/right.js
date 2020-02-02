class RightConvert{
    toString(rightList) {//将权限对象数组，转换为简单的字符串数组
        let rights = [],modules = [],_ = this
                
        rightList.forEach(v => {
            if(typeof v == 'string') {
                rights.push(v)
            } else if(v.isEnabled === undefined || v.isEnabled === true) {
                let mods = [...modules, v.Flag]
                modules = mods
                rights = [...rights, ...(_._decodeRight(v.Flag, v.Functions))]
            }
        })

        return {rights, modules}
    }

    appendRight(rights, strRights, modules) {//将当前的权限
    }

    _decodeRight(flag, Functions) {
        if(typeof Functions == 'object') {
            let arr = []
            Functions.forEach(v => {
                let prefix = `${flag}_${v.id}`

                return v.functions.forEach((vv) => {
                    if(vv.checked === undefined || vv.checked === true)
                        arr.push(`${prefix}_${vv.id}`)
                })
            })

            return arr
        } else {
            return functions
        }
    }
}

export default RightConvert