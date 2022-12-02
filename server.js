const express = require('express')
const connectDB = require('./config/db')
var cors = require('cors')
const path = require('path')
const mongoose = require("mongoose");
const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const User = require('./models/User');
const Stores = require('./models/Stores');
const Product = require('./models/Product');
const Request = require('./models/Request');
const Category = require('./models/Category');
const AdminRequest = require('./models/AdminRequest')
const config = require("config");
const Admin = require('./models/Admin');
// const db = config.get("mongoURI");
const app = express();
var mongoURI = 'mongodb+srv://vinay:vinay.123@cluster0.u5kok.mongodb.net/?retryWrites=true&w=majority'


const PORT = process.env.PORT || 5000

const runServer = async () => {
    // Mongoolia

    // Admin Bro
    AdminBro.registerAdapter(AdminBroMongoose);
    let adminBro = null;

    const connection = await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const contentParent = {
        name: 'Panel',
        icon: '',
    }
    adminBro = new AdminBro({
        databases: [connection],
        rootPath: "/admin",

        resources: [
            {
                resource: User,
                options: {
                    parent: contentParent
                },
            },
            {
                resource: Stores,
                options: {
                    parent: contentParent
                },
            },
            {
                resource: Product,
                options: {
                    parent: contentParent
                },
            },
            {
                resource: Request,
                options: {
                    parent: contentParent
                },
            },
            {
                resource: Category,
                options: {
                    parent: contentParent
                },
            },
            {
                resource: AdminRequest,
                options: {
                    parent: contentParent
                },
            },
            {
                resource: Admin,
                options: {
                    parent: contentParent
                },
            }
        ],

        branding: {
            companyName: "Ebono Admin Panel",
            logo: 'https://i.postimg.cc/tgByjSqc/playlogo.png'
        },
    });


    // const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    //     authenticate: async (email, password) => {
    //         const admin = await Admin.findOne({ email }).select("+password");
    //         if (admin) {
    //             console.log(admin);

    //             const isMatch = await admin.matchPassword(password);
    //             return isMatch;
    //         }
    //         return false;
    //     },
    //     cookiePassword: "secretSpooky",
    // });
    const router = AdminBroExpress.buildRouter(adminBro)
    app.use(adminBro.options.rootPath, router);

    app.use(express.json({
        extended: false
    }))
    app.use(cors())

    app.get("/uploads/image/:name", (req, res) => {
        res.sendFile(path.join(__dirname, `./uploads/image/${req.params.name}`));
    });

    app.get('/', (req, res) => {
        res.send('API Running')
    })

    app.use('/api/user', require('./routes/api/user'))
    app.use('/api/auth', require('./routes/api/auth'))
    app.use('/api/categories', require('./routes/api/categories'))
    app.use('/api/product', require('./routes/api/product'))
    app.use('/api/request', require('./routes/api/request'))
    app.use('/api/stores', require('./routes/api/stores'))
    app.use('/api/stripe', require('./routes/api/stripe'))
    app.use('/api/adminrequest', require('./routes/api/adminRequest'))
    app.use('/api/walmart', require('./routes/api/walmart'))

    app.listen(PORT, () => {
        console.log(`Server Started on Port ${PORT}`)
    })



    // const publicKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCdvOMD42brPdBIxSU8UNCH8GWChkNvOfbpc4NGj6eK0gABpSE1+XLdDd7SUZccFetk+RdbvYKxVbONmEgfU9axaEygfpGMJcLBZDc8JRNO7qlDKB0UKrl67FBk2rIV6hwMAbdylUPSfAfe9wKOUL0XbdyPraWjStHJscLni1MJn7AA6pprBbWwW8SYlyxhE7NWbDUeRXzKJDDFEDp49GITs7JnXaIQST7paDfdoRRBgHwWHUyLbTRhIz+llByl9Xotag0vLZgd5dg1Rx7AAne1ikIR04WJGl1pKlD4Il9OpQdQliTaUKGdtJJbQKblkIIVN5qt3udbOpa/tj9GJMSj rsa-key-20221013'
    // const consumerId = '133a4cd6-909f-4811-82e0-2181118c4726'
    // const privateKey = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALfNRYHOqVbVAhYY\
    // IFsE4NyPSknb13bRgLo4bz/52fCV3KVyWHQPDXKbg6lHkjBUTXGmvBo+GfuILIaK\
    // YcLkvLSxNk0SWHBq+Kfv5mmQF8oJVlMVMVzRmhB2aH16lhtsqCIeiBOLMPMqXYd/\
    // v8yRxg4sT9trPFiu30aV+YyQoD6BAgMBAAECgYBlP/jYJwX1xWVe0m+QdEGCfpTH\
    // 1wj8dTBaZRgzv+kktQlVQoYjeN9JkQ2YRMrtQKNgxh68vhUGEN+mRbjQ6bxhRmSv\
    // CAwSFMFvij+u7secMMPgmeAr9IF/I/iejk2pPHbEo/RFV2t0zOgZ1pe+qzA/xrLM\
    // VQOEVcbfcnHAZS66AQJBAN6Ost1TDUVIsaqBAtdTU/kyuZvtSVAvxLdnUxd4WGNY\
    // nnXsLK5dyRg5tzgW+hWc29+ppGfgFffEgD3sYHLxzVECQQDTa7rZVyyY5DiA4Y5/\
    // xBXn+ZxpP7k3xZLxl/WfmeLnC/i56zZ39N+c0dYMDih6cDo8EP+TrYrg4/d5smpe\
    // VFIxAkEAqVxOIL6iyqaXDPlAADwZGvnO5SmdMLgpKqgmQyYBnRhC/dnL5qTX8ud4\
    // 1eYmSWwkpf+ibKnKDdIrBPRsMQxxAQJBAMCFEyqipSu8dm919asGxePteq6kpmbQ\
    // 9RQmijaBjQtT7XRvabQmOhG1SrLDmbyUwZK8795sY1CShmI9Q3sOUaECQDL35Kg8\
    // 36sJxgNGaaibsALIbVvcy6A1DowOhHRC/xbT8wSnA+9lI8Q+hHNqPhJ0GvdiB198\
    // bMKHC94bonAog/k="
    // const keyVer = '2'
}
connectDB();
runServer()