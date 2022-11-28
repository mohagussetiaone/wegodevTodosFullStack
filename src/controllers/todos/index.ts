import assert from "assert"
import { Request, Response } from "express"
import TodoModel from "../../models/todo"
import { Todo } from "../../types/todo"

// Declare getTodos dengan async function (semua todos)
export const getTodos = async (req: Request, res: Response) => {
    // inisialisasi todos untuk menerima schema Todo berbentuk Array
    // Menggunakan await untuk hasil dari schema TodoModel untuk mencari data (method find dari moongose dari db lewat todoModels)
    const todos: Todo[] = await TodoModel.find()
    // Mengirimkan respon jika status bernilai 200 maka akan diconvert menjadi data json dari variabel todos dengan cara destruct
    res.status(200).json({ todos })
}

// Function untuk mendapatkan params id
export const getTodo = async (req: Request, res: Response) => {
    // Method Await dari asycn untuk menerima TodoModel dengan diikuti oleh methode findById untuk mencari ID dari request params dari id
    // didalamnya menerima parameter kembali yakni err untuk handling error dan result untuk handling result
    await TodoModel.findById(req.params.id, (err, result) => {
        // validation error
        if (err) {
            // Jika respon yang diberikan bernilai status 400 kemudian akan diparsing agar menjadi data json berupa data error yang bernilai dari err
            res.status(400).json({
                error: err
            })
        } else {
            // Jika kondisi bernilai else dan mempunyai status code 200 maka hasil akan diconvert menjadi data json berupa data result yang di destruct
            res.status(200).json({
                result
            })
        }
    })
}

// Function addTodo untuk menambahkan todo dengan method Promis memiliki data void
export const addTodo = async (req: Request, res: Response): Promise<void> => {
    // declare body dengan method Pick serta menerima schema todo untuk memilih title atau status body bernilai request body
    const body: Pick<Todo, "title" | "status"> = req.body
    // Validation jika tidak tersedia title atau status maka akan mengembalikan response status 401
    // kemudian hasil diconvert ke data json yang berisi status code 401 dan error message sesuai dengan data dari body.title dan body.status
    if (!body.title || !body.status) {
        res.status(401).json({
            status: 401,
            errorMessage: `ValidationError : Todo validation failed : title : ${body.title}, status : ${body.status}`
        })
        // Untuk memberhentikan proses validasi
        return
    }

    // declare form untuk todo sesuai dengan data dari moongose
    const newTodoModel = new TodoModel({
        title: body.title,
        status: body.status
    })

    // Declare newTodo untuk menerima newTodoModel dengan function save()serta bersifat await 
    const newTodo = await newTodoModel.save()
    // declare updatealltodo dari hasil TodoModel lalu akan dijalankan method find seperti di get todo
    const updatedAllTodosAfterSave = await TodoModel.find()
    // untuk respon status 201 (data sukses terbuat) dan akan diconvert menjadi json serta memberi result dari convert json metode destruct
    res.status(201).json({
        message: "Todo Successfully added!",
        addedTodo: newTodo,
        allTodosAfterAddition: updatedAllTodosAfterSave
    })
}

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    // destruct params bernilai id dan body yang dimasukkan untuk request (req dari parameter)
    const {
        params: { id },
        body
    } = req
    // validasi jika tidak tersedia body untuk title, status dan tidak ada id kemudian akan mengembalikan respon
    if (!body.title || !body.status || !id) {
        // Mengembalikan respon status untuk 401 dan diconvert menjadi json dengan hasil metode destruct hasilnya adalah status dan errorMessage
        res.status(401).json({
            status: 401,
            errorMessage: `validationError : _id or required body properties is not defined.`
        })
        // Jika statement terpenuhi kemudian akan berhenti menggunakan return
        return
    }
    // declare updated todo untuk mencari todo baru dan mengupdate tanpa menambahkan todo baru, dari schema TodoModel dan menerima _id dari generate id params bernilai id serta data body
    const updatedTodo = await TodoModel.findByIdAndUpdate({ _id: id }, body)
    // declare function untuk mengambil semua data dari todo dengan method find
    const updatedAllTodosAfterUpdate = await TodoModel.find()

    // jika proses update todo gagal maka akan mengembalikan res status 501 serta hasil akan diconvert ke data json bernilai status dan errorMessage yang terjadi
    if (!updatedTodo) {
        res.status(501).json({
            status: 501,
            errorMessage: `Edit todo failed, Not Implemented`
        })
        // Memberhentikan proses jika task diatas sudah selesai
        return
    }

    // Jika proses todo berhasil maka akan menampilkan status 200 dan menghasilkan result json message updatedtodo dan todo bernilai UpdatedAllTodosAfterUpdate
    res.status(200).json({
        message: 'Todo Successfully edited',
        updatedTodo,
        todos: updatedAllTodosAfterUpdate
    })
}

// declare untuk function menghapus todo yang menerima paramater request dan respon dengan asycn
export const removeTodo = async (req: Request, res: Response) => {
    // destruct id untuk handle params id
    const {
        params: { id },
    } = req

    // validasi ketika tidak tersedia input untuk params id maka akan menampilkan pesan error status 401 dan messagenya
    if (!id) {
        res.status(401).json({
            status: 401,
            errorMessage: `validationError : Params _id is not define`
        })
        // Saat proses sudah selesai
        return
    }
    // declare removedTodo untuk menerima schema TodoModel dan menjalankan findByIdAndRemove dengan menerima parameter dari idnya
    const removedTodo = await TodoModel.findByIdAndRemove(id)
    // declare fungsi untuk update semua todo setelah diremove dengan method find
    const updatedAllTodosAfterRemove = await TodoModel.find()

    // validasi saat tidak ada fungsi removedTodo
    // Maka akan memproses respon status dengan nilai 501 dan akan menampilkan pesan eerrornya
    if (!removedTodo) {
        res.status(501).json({
            status: 501,
            errorMessage: `Remove todo failed. Not Implemented`
        })
        // menghentikan proses validasi
        return
    }

    res.status(200).json({
        message: `Todo Successfully removed`,
        removeTodo,
        todos: updatedAllTodosAfterRemove
    })
}