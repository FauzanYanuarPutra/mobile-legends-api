"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Hero {
  hero_id: number;
  hero_name: string;
  hero_role: string;
  hero_specially: string;
  hero_avatar: string;
}

export default function Home() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [search, setSearch] = useState({
    name: '',
    role: '',
  });
  const [roles, setRoles] = useState<string[]>([]);


  console.log(roles)
  const [originalData, setOriginalData] = useState<Hero[]>([]); 
  

  const getData = () => {
    axios
      .get('https://api.dazelpro.com/mobile-legends/hero')
      .then((res) => {
        setHeroes(res.data.hero);
        setOriginalData(res.data.hero);
        const roles = res.data.hero.map((hero: Hero) => hero.hero_role);
        const uniqueRoles: any[] = [];
        roles.forEach((role: any) => {
          if (!uniqueRoles.includes(role) && !role.includes(',')) {
            uniqueRoles.push(role);
          }
        });
        setRoles(uniqueRoles);
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const searchData = () => {
    console.log(search)

    let filterHeroes = originalData.filter((hero: Hero) => {
      return hero.hero_name.toLowerCase().includes(search.name.toLowerCase());
    });

    if (search.role !== '') {
      filterHeroes = filterHeroes.filter((hero: Hero) => {
        return hero.hero_role.toLowerCase().includes(search.role.toLowerCase());
      });
    }


    setHeroes(filterHeroes);
  };

  const resetData = () => {
    setHeroes(originalData);
    setSearch({
      name: '',
      role: '',
    }); 
  };

  return (
    <div className='w-[90%] mx-auto max-w-[800px] my-10'>
      <div className='my-10 flex gap-2'>
        <input
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          type='text'
          placeholder='Search'
          className='w-[60%] rounded-lg shadow-lg p-2'
          value={search.name} 
        />
        <select name="role" id="" onChange={(e) => setSearch({ ...search, role: e.target.value })} className='w-[20%] rounded-lg shadow-lg p-2'>
          <option value="">Pilih Roles</option>
          {roles.map((role: string) => (
            <option key={role} value={role} >
              {role}
            </option>
          ))}
        </select>
        <button onClick={searchData} className='bg-blue-500 text-white px-4 py-2 rounded-lg'>
          Search
        </button>
        <button onClick={resetData} className='bg-red-500 text-white px-4 py-2 rounded-lg'>
          Reset
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
        {heroes.map((hero: Hero) => (
          <div key={hero.hero_id} className='w-full bg-white rounded-lg p-5'>
            <div>
              <h1 className='text-xl font-medium'>{hero.hero_name}</h1>
              <p>{hero.hero_role}</p>
              <p>{hero.hero_specially}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

