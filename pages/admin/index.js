import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";





const Admin = ({userInfo}) => {
    return (
        <Layout>
            <h1>Admin Dashboard</h1>
            <br />
            <div className="row">
                <div className="col-md-4">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/admin/category/create">
                                <a className="nav-link">Create category</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/category/read">
                                <a className="nav-link">Read all categories</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/link/read">
                                <a className="nav-link">Read all links</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/user/profile/update">
                                <a className="nav-link">Update profile</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="col-md-8"></div>
            </div>
        </Layout>

    )
    
}

export default withAdmin(Admin);