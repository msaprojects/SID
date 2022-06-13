<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /// create dummy data inside table users
        DB::table('users')->insert(['nama' => 'Administrator', 'username' => 'adminsistem', 'password' => bcrypt('123qwerty'), 'jabatan' => 'admin', 'aktif' => '1']);
    }
}
