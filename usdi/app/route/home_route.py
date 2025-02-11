from app import app
from flask import Flask,request,jsonify,redirect,url_for
from datetime import datetime
from dbconfig import db
# engine_container
import json
from sqlalchemy import text


@app.route("/")
@app.route("/index")
def index():
  sql = text("""select user_name,role_name,email_id,mobile_no,user_password from public.user_master AS u INNER JOIN public.role_master AS r ON u.role_id = r.role_id """)
  result = db.session.execute(sql)
  output = []
  for row in result:
    output.append({"user_name":row.user_name,"user_password":row.user_password,"email_id":row.email_id,"mobile_no":row.mobile_no,"role_name":row.role_name})

  return jsonify(output)


@app.route("/registration",methods=['POST'])
def registration():
 
 data = request.json
 user_name = data.get('user_name')
 user_password = data.get('user_password')
 mobile_no = data.get('mobile_no')
 email_id = data.get('email_id')
 role_id = 2
 insert_query =text("""INSERT INTO public.user_master (user_name,user_password,mobile_no,email_id,role_id) VALUES (:user_name, :user_password, :mobile_no, :email_id, :role_id)""")
 try:
  db.session.execute(insert_query, {'user_name': user_name, 'user_password': user_password, 'mobile_no':mobile_no, 'email_id':email_id, 'role_id':role_id})
  db.session.commit()
  return jsonify("Register Sucessfully")
 except Exception as e:
       
        return jsonify({"Register Unsucessfull"})




response = {}
# @app.route("/login",methods=['POST'])
# def login():
#  data = request.json
#  email_id = data.get('email_id')
#  user_password = data.get('user_password')
#  result = db.session.execute(text("""select user_id,user_name,role_name from public.user_master AS u INNER JOIN public.role_master AS r ON u.role_id = r.role_id where email_id = :email_id AND user_password = :user_password"""),{'email_id':email_id,'user_password':user_password}) 
#  result_array = result.fetchone();
#  if result_array:   
#         response['post'] = ""
#         response['message'] = 'Login successful'
#         response['user_id'] = result_array.user_id
#         response['role'] = result_array.role_name
#         response['status'] = 1  
#  else:
#         response['message'] = 'invalid'
#         response['status'] = 0

#  return jsonify(response)   


@app.route("/login", methods=['POST'])
def login():
    data = request.json
    email_id = data.get('email_id')
    user_password = data.get('user_password')

    if not email_id or not user_password:
        return jsonify({"message": "email_id and user_password are required"})

    try:
        result = db.session.execute(
            text("""SELECT u.user_id, u.user_name, r.role_name 
                    FROM public.user_master AS u 
                    INNER JOIN public.role_master AS r 
                    ON u.role_id = r.role_id 
                    WHERE u.email_id = :email_id AND u.user_password = :user_password"""),{'email_id': email_id, 'user_password': user_password}).fetchone()

        if result:
            user_id = result.user_id
            user_name = result.user_name
            role_name = result.role_name
            current_time = datetime.now()

            db.session.execute(
                text("""
                    INSERT INTO public.login_log (user_id, login_time, created_on, updated_on) VALUES (:user_id, :login_time, :current_time, :current_time)"""),
                {
                    'user_id': user_id,
                    'login_time': current_time,
                    'current_time': current_time
                })
            
            db.session.commit()
            response = {
                'post': "",
                'message': 'Login successful',
                'user_id': user_id,
                'role': role_name,
                'status': 1
            }
        else:
            response = {
                'message': 'Invalid email_id or password',
                'status': 0
            }
        
        return jsonify(response), 200 if result else 401

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred during login", "error": str(e)}), 500


# @app.route("/logout", methods=['POST'])
# def logout():
#     response = {'message': 'Logout successful', 'status': 1}
#     return jsonify(response)
   


@app.route("/logout", methods=['POST'])
def logout():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    try:
        current_time = datetime.now()

        result = db.session.execute(
            text("""
                UPDATE public.login_log
                SET logout_time = :logout_time, updated_on = :current_time WHERE user_id = :user_id AND logout_time IS NULL """),
            {
                'user_id': user_id,
                'logout_time': current_time,
                'current_time': current_time
            })

        if result.rowcount == 0:
            return jsonify({"message": "No active session found for user_id"}), 404

        db.session.commit()

        return jsonify({"message": "Logout successful", "status": 1}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Logout time recording unsuccessful", "error": str(e)}), 500

    

@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.json
    email_id = data.get('email_id')
    new_password = data.get('new_password')

    # Check if the email exists in the database
    user = db.session.execute(text("""SELECT * FROM public.user_master WHERE email_id = :email_id"""), {'email_id': email_id}).fetchone()

    if user : 
        db.session.execute(text("""UPDATE public.user_master SET user_password = :new_password WHERE email_id = :email_id"""), {'new_password': new_password, 'email_id': email_id})
        db.session.commit()
        return jsonify({"message": "password is successfully changed"})
        
    else:
        return jsonify({"message": "Email is not found"})
    

@app.route('/getroles', methods=['GET'])
def getroles():
    role = db.session.execute(text("SELECT role_name FROM role_master")).fetchall()
    output=[]
    for row in role:
        output.append({'role_name':row.role_name})
    return jsonify(output)


@app.route("/insertuser", methods=['POST'])
def insertuser():
    data = request.json
    user_name = data.get('user_name')
    user_password = data.get('user_password')
    email_id = data.get('email_id')
    mobile_no = data.get('mobile_no')
    role_name = data.get('role_name')

    try:
        # Check if the role already exists
        existing_role = db.session.execute(text("SELECT role_id FROM role_master WHERE role_name = :role_name"), {"role_name": role_name}).fetchone()

        if existing_role:
            role_id = existing_role[0]  # Retrieve role_id if role exists
        else:
            # Insert the new role if it doesn't exist and retrieve its role_id
            result = db.session.execute(text("INSERT INTO role_master (role_name) VALUES (:role_name) RETURNING role_id"), {"role_name": role_name})
            role_id = result.fetchone()[0]

        # Insert the user with the retrieved/created role_id
        db.session.execute(text("INSERT INTO user_master (user_name, user_password, email_id, mobile_no, role_id) VALUES (:user_name, :user_password, :email_id, :mobile_no, :role_id)"), {"user_name": user_name, "user_password": user_password, "email_id": email_id, "mobile_no": mobile_no, "role_id": role_id})
        
        db.session.commit()
        
        return jsonify({"message": "User inserted successfully.", "status_code": 1})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error inserting user.", "status_code": 0})


@app.route("/select", methods=['GET'])
def select():
   
    sql = text("""select u.user_name,r.role_name,u.email_id,u.mobile_no,u.is_active from public.user_master AS u INNER JOIN public.role_master AS r ON u.role_id = r.role_id """)
    result = db.session.execute(sql)

   
    output = [{"user_name": row.user_name,"role_name": row.role_name, "email_id":row.email_id, "mobile_no":row.mobile_no,"is_active":row.is_active} for row in result]

    return jsonify(output)


@app.route("/total_users", methods=['GET'])
def total_users():
    total_users = db.session.execute(text("SELECT COUNT(*) FROM public.user_master")).scalar()

    total_vector_data = db.session.execute(text("SELECT COUNT(*) FROM public.catalogue_master WHERE data_type = 'vector'")).scalar()

    total_raster_data = db.session.execute(text("SELECT COUNT(*) FROM public.catalogue_master WHERE data_type = 'raster'")).scalar()


    total_wms = db.session.execute(text("SELECT COUNT(*) FROM public.catalogue_master")).scalar()

    
    return jsonify({"total users": total_users,
                    "total_vector_data": total_vector_data,
                    "total_wms": total_wms,
                    "total_raster_data":total_raster_data})


@app.route("/viewloginlog", methods=['POST'])
def viewloginlog():
    data = request.json
    email_id = data.get('email_id')
    
    try:
        sql = text("""
            SELECT l.login_time, l.logout_time, u.email_id 
            FROM public.user_master AS u 
            INNER JOIN public.login_log AS l ON u.user_id = l.user_id 
            WHERE u.email_id = :email_id
        """)
        
        result = db.session.execute(sql, {'email_id': email_id})

        output = [{"login_time": row.login_time, "logout_time": row.logout_time, "email_id": row.email_id} for row in result]

        return jsonify(output)

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/aduserprofile", methods=['POST'])
def aduserprofile():
    data = request.json
    email_id = data.get('email_id')

    user = db.session.execute(text("SELECT * FROM public.user_master WHERE email_id = :email_id"), {"email_id": email_id}).fetchone()

    if user:
        new_status = not user.is_active 
        db.session.execute(text("UPDATE public.user_master SET is_active = :new_status WHERE email_id = :email_id"), {"new_status": new_status, "email_id": email_id})
        db.session.commit()
        
        message = "User profile deactivated successfully." if not new_status else "User profile activated successfully."
        return jsonify({"message": message, "status_code": 1})
    else:
        return jsonify({"message": "User not found.", "status_code": 0})


# @app.route("/aduserprofile", methods=['POST'])
# def aduserprofile():
#     data = request.json
#     email_id = data.get('email_id')

#     with engine_container.connect() as connection:
#         user = connection.execute(text("SELECT * FROM public.user_master WHERE email_id = :email_id"), {"email_id": email_id}).fetchone()

#         if user:
#             new_status = not user.is_active 
#             connection.execute(text("UPDATE public.user_master SET is_active = :new_status WHERE email_id = :email_id"), {"new_status": new_status, "email_id": email_id})
#             message = "User profile deactivated successfully." if not new_status else "User profile activated successfully."
#             return jsonify({"message": message, "status_code": 1, "new_status": new_status})
#         else:
#             return jsonify({"message": "User not found.", "status_code": 0})


@app.route("/updateuser", methods=['POST'])
def updateuser():
    data = request.json
    email_id = data.get('email_id')
    user_name = data.get('user_name')
    mobile_no = data.get('mobile_no')
    role_name = data.get('role_name')

    try:
        # Check if the user exists
        existing_user = db.session.execute(text("SELECT user_id FROM user_master WHERE email_id = :email_id"), {"email_id": email_id}).fetchone()

        if existing_user:
            # Check if the role exists
            existing_role = db.session.execute(text("SELECT role_id FROM role_master WHERE role_name = :role_name"), {"role_name": role_name}).fetchone()

            if existing_role:
                role_id = existing_role[0]  # Retrieve role_id if role exists
           
            db.session.execute(text("UPDATE user_master SET user_name = :user_name, mobile_no = :mobile_no, role_id = :role_id WHERE email_id = :email_id"), {"user_name": user_name,"mobile_no": mobile_no, "role_id": role_id, "email_id": email_id})
            
            db.session.commit()
            
            return jsonify({"message": "User details updated successfully.", "status_code": 1})
        else:
            return jsonify({"message": "User not found.", "status_code": 0})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user details.", "status_code": 0})
    




@app.route("/update_profile", methods=['POST'])
def update_profile():
    response = {}
    data = request.json
    user_id = data.get('user_id')  

    if not user_id:
        response['message'] = 'User ID is missing in request data'
        response['status'] = 0
        return jsonify(response) 
    
    user_name = data.get('user_name')
    mobile_no = data.get('mobile_no')
    
    try:
        
        current_profile = db.session.execute(text("""
            SELECT user_name, email_id, mobile_no
            FROM public.user_master
            WHERE user_id = :user_id
        """), {'user_id': user_id}).fetchone()
        
        if not current_profile:
            response['message'] = 'User ID not found'
            response['status'] = 0
            return jsonify(response)
        
        previous_profile = {
            'user_name': current_profile.user_name,
            'mobile_no': current_profile.mobile_no
        }
        
        db.session.execute(text("""
            UPDATE public.user_master
            SET user_name = :user_name, mobile_no = :mobile_no
            WHERE user_id = :user_id
        """), {'user_name': user_name,'mobile_no': mobile_no, 'user_id': user_id})
        db.session.commit()

        updated_profile = {
            'user_name': user_name if user_name else current_profile.user_name,
            'mobile_no': mobile_no if mobile_no else current_profile.mobile_no
        }
        
        response['message'] = 'Profile updated successfully'
        response['status'] = 1
        response['previous_profile'] = previous_profile
        response['updated_profile'] = updated_profile
    except Exception as e:
        db.session.rollback()
        response['message'] = 'Failed to update profile'
        response['status'] = 0
        response['error'] = str(e)
    
    return jsonify(response)


@app.route("/get_profile", methods=['GET'])
def get_profile():
    response = {}
    user_id = request.args.get('user_id')

    if not user_id:
        response['message'] = 'User ID is missing in request data'
        response['status'] = 0
        return jsonify(response)

    try:
        profile = db.session.execute(text("""
            SELECT user_name, email_id, mobile_no
            FROM public.user_master
            WHERE user_id = :user_id
        """), {'user_id': user_id}).fetchone()

        if not profile:
            response['message'] = 'User ID not found'
            response['status'] = 0
            return jsonify(response)

        response['message'] = 'Profile data fetched successfully'
        response['status'] = 1
        response['profile'] = {
            'user_name': profile.user_name,
            'email_id': profile.email_id,
            'mobile_no': profile.mobile_no
        }
    except Exception as e:
        response['message'] = 'Failed to fetch profile data'
        response['status'] = 0
        response['error'] = str(e)

    return jsonify(response)


@app.route("/catalogue", methods=["GET"])
def catalogue():
    sql = text("""select catalogue_id,dataset_name,schema_name,table_name,is_active,data_type from public.catalogue_master""")
    result = db.session.execute(sql)
    output = [{"catalogue_id": row.catalogue_id, "dataset_name": row.dataset_name,"schema_name": row.schema_name,"is_active":row.is_active, "table_name":row.table_name, "data_type":row.data_type} for row in result]

    return jsonify(output)


@app.route("/addcatalogue", methods=["POST"])
def addcatalogue():
    data = request.json
    dataset_name = data.get('dataset_name')
    table_name = data.get('table_name')
    schema_name = data.get('schema_name')
    data_type = data.get('data_type')
    
    insert_query =text("""INSERT INTO public.catalogue_master (dataset_name,schema_name,table_name,data_type) VALUES (:dataset_name, :schema_name, :table_name, :data_type)""")
    try:
     db.session.execute(insert_query, {'dataset_name': dataset_name, 'schema_name': schema_name, 'table_name': table_name, 'data_type':data_type})
     db.session.commit()
     return jsonify({"message":"Catalogue Added Successful"})
    except Exception as e: 
        return jsonify({"message":"Catalogue Added Unsucessfull"})


@app.route("/updatecatalogue", methods=['POST'])
def updatecatalogue():
    data = request.json
    catalogue_id = data.get('catalogue_id')
    dataset_name = data.get('dataset_name')
    table_name = data.get('table_name')
    schema_name = data.get('schema_name')
    data_type = data.get('data_type')
    
    update_query = text("""UPDATE public.catalogue_master SET dataset_name = :dataset_name, schema_name = :schema_name, table_name = :table_name, data_type = :data_type  WHERE catalogue_id = :catalogue_id""")
    try:
        db.session.execute(update_query, {'dataset_name': dataset_name, 'schema_name': schema_name, 'table_name': table_name, 'catalogue_id': catalogue_id, 'data_type': data_type})
        db.session.commit()
        return jsonify({"message":"Catalogue Update Successful"})
    except Exception as e:
        return jsonify({"message":"Catalogue Update Unsuccessful"})


@app.route("/adcatalogue", methods=['POST'])
def aadcatalogue():
    data = request.json
    dataset_name = data.get('dataset_name')

    catalogue = db.session.execute(text("SELECT dataset_name,is_active  FROM public.catalogue_master WHERE dataset_name = :dataset_name"), {"dataset_name": dataset_name}).fetchone()

    if catalogue:
        new_status = not catalogue.is_active 
        db.session.execute(text("UPDATE public.catalogue_master SET is_active = :new_status WHERE dataset_name = :dataset_name"), {"new_status": new_status, "dataset_name":dataset_name})
        db.session.commit()
        
        message = "Catalogue deactivated successfully." if not new_status else "Catalogue activated successfully."
        return jsonify({"message": message, "status_code": 1})
    else:
        return jsonify({"message": "Catlogue not found.", "status_code": 0})



@app.route('/getdataset_name', methods=['GET'])
def getdataset_name():
    dataset_name = db.session.execute(text("SELECT dataset_name FROM catalogue_master")).fetchall()
    output=[]
    for row in dataset_name:
        output.append({'dataset_name':row.dataset_name})
    return jsonify(output)


@app.route("/selectmetadata", methods=['GET'])
def selectmetadata():
    sql = text("""
        SELECT 
            m.data_source,
            m.data_format,
            m.created_on as m_created_on,
            m.updated_on as m_updated_on,
            m.created_by,
            m.updated_by,
            m.is_active as m_is_active,
            m.catalogue_id as catalogue_id,
            cm.dataset_name as dataset_name
        FROM 
            public.meta_data m
        JOIN 
            public.catalogue_master cm ON m.catalogue_id = cm.catalogue_id
    """)
    result = db.session.execute(sql)

    output = [
        {
            "catalogue_id": row.catalogue_id,
            "data_format": row.data_format,
            "data_source": row.data_source,
            "dataset_name": row.dataset_name,
            "created_by": row.created_by,
            "updated_by": row.updated_by,
            "is_active": row.m_is_active,
            "created_on": row.m_created_on,
            "updated_on": row.m_updated_on
        }
        for row in result
    ]

    return jsonify(output)






@app.route('/addmetadata', methods=['POST'])
def addmetadata():
    data = request.json
    dataset_name = data.get('dataset_name')
    data_format = data.get('data_format')
    data_source = data.get('data_source')

    if not dataset_name:
        return jsonify({"message": "dataset_name is required"}), 400

  
    fetch_catalogue_id_query = text("""SELECT catalogue_id FROM public.catalogue_master WHERE dataset_name = :dataset_name""")
    
    try:
        result = db.session.execute(fetch_catalogue_id_query, {'dataset_name': dataset_name}).fetchone()
        if result is None:
            return jsonify({"message": "Invalid dataset_name"}), 400
        
        catalogue_id = result[0]

        insert_query = text("""INSERT INTO public.meta_data (catalogue_id, data_format, data_source, created_on, updated_on) 
                               VALUES (:catalogue_id, :data_format, :data_source, :created_on, :updated_on)""")
        
        db.session.execute(insert_query, {
            'catalogue_id': catalogue_id,
            'data_format': data_format,
            'data_source': data_source,
            'created_on': datetime.now(),
            'updated_on': datetime.now()
        })
        db.session.commit()
        return jsonify({"message": "Metadata created successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Metadata creation unsuccessful", "error": str(e)})
    



@app.route('/updatemetadata', methods=['POST'])
def updatemetadata():
    data = request.json
    dataset_name = data.get('dataset_name')
    data_source = data.get('data_source')
    data_format = data.get('data_format')

    if not dataset_name:
        return jsonify({"message": "dataset_name is required"})

    fetch_catalogue_id_query = text("""SELECT catalogue_id FROM public.catalogue_master WHERE dataset_name = :dataset_name""")
    
    try:
        result = db.session.execute(fetch_catalogue_id_query, {'dataset_name': dataset_name}).fetchone()
        if result is None:
            return jsonify({"message": "Invalid dataset_name"})
        
        catalogue_id = result[0]

        update_query = text("""UPDATE public.meta_data 
                               SET data_source = :data_source, 
                                   data_format = :data_format,
                                   updated_on = :updated_on
                               WHERE catalogue_id = :catalogue_id""")
        
        db.session.execute(update_query, {
            'catalogue_id': catalogue_id,
            'data_source': data_source,
            'data_format': data_format,
            'updated_on': datetime.now()
        })
        db.session.commit()
        return jsonify({"message": "Metadata updated successfully"})
    except Exception as e:
        db.session.rollback()
        app.logger.error("Error during metadata update: %s", str(e))
        return jsonify({"message": "Metadata update unsuccessful", "error": str(e)})
    


@app.route("/admetadata", methods=['POST'])
def admetadata():
    data = request.json
    dataset_name = data.get('dataset_name')

    if dataset_name:
        # Fetching catalogue_id based on dataset_name
        catalogue = db.session.execute(
            text("SELECT catalogue_id FROM public.catalogue_master WHERE dataset_name = :dataset_name"), 
            {"dataset_name": dataset_name}
        ).fetchone()

        if catalogue:
            catalogue_id = catalogue.catalogue_id
            
            metadata = db.session.execute(
                text("SELECT is_active FROM public.meta_data WHERE catalogue_id = :catalogue_id"), 
                {"catalogue_id": catalogue_id}
            ).fetchone()

            if metadata:
                new_status = not metadata.is_active
                
                db.session.execute(
                    text("UPDATE public.meta_data SET is_active = :new_status WHERE catalogue_id = :catalogue_id"), 
                    {"new_status": new_status, "catalogue_id": catalogue_id}
                )
                db.session.commit()

                message = "Metadata deactivated successfully." if not new_status else "Metadata activated successfully."
                return jsonify({"message": message, "status_code": 1, "is_active": new_status})
            else:
                return jsonify({"message": "Metadata not found.", "status_code": 0})
        else:
            return jsonify({"message": "Catalogue not found.", "status_code": 0})
    else:
        return jsonify({"message": "Dataset name not provided.", "status_code": 0})
    

# @app.route("/logintime", methods=['POST'])
# def logintime():
#     data = request.json
#     user_id = data.get('user_id')

#     if not user_id:
#         return jsonify({"message": "user_id is required"}), 400

#     try:
#         # Verify user_id exists
#         result = db.session.execute(
#             text("SELECT 1 FROM public.user_master WHERE user_id = :user_id"),
#             {'user_id': user_id}
#         ).fetchone()
        
#         if result is None:
#             return jsonify({"message": "Invalid user_id"}), 404

#         current_time = datetime.now()

#         # Insert login time
#         db.session.execute(
#             text("""
#                 INSERT INTO public.login_log (user_id, login_time, created_on, updated_on)
#                 VALUES (:user_id, :login_time, :current_time, :current_time)
#             """),
#             {
#                 'user_id': user_id,
#                 'login_time': current_time,
#                 'current_time': current_time
#             }
#         )
#         db.session.commit()

#         return jsonify({"message": "Login time recorded successfully"}), 201

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": "Login time recording unsuccessful", "error": str(e)}), 500

# @app.route("/logouttime", methods=['POST'])
# def logouttime():
#     data = request.json
#     user_id = data.get('user_id')

#     if not user_id:
#         return jsonify({"message": "user_id is required"}), 400

#     try:
#         current_time = datetime.now()

#         # Update logout time
#         result = db.session.execute(
#             text("""
#                 UPDATE public.login_log
#                 SET logout_time = :logout_time, updated_on = :current_time
#                 WHERE user_id = :user_id AND logout_time IS NULL
#             """),
#             {
#                 'user_id': user_id,
#                 'logout_time': current_time,
#                 'current_time': current_time
#             }
#         )

#         if result.rowcount == 0:
#             return jsonify({"message": "No active session found for user_id"}), 404

#         db.session.commit()

#         return jsonify({"message": "Logout time recorded successfully"}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": "Logout time recording unsuccessful", "error": str(e)}), 500
