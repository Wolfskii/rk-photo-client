import { useState, useEffect, useCallback } from 'react'
import './Albums.scss'
import Card from './AlbumCard'
import Spinner from './Spinner'
import Pagination from './Pagination'

/**
 * Albums component displays a collection of album cards fetched from an API.
 * @returns {JSX.Element} - Rendered Albums component.
 */
export default function Albums() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [albums, setAlbums] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFetching, setIsFetching] = useState(false)
  const itemsPerPage = 8

  /**
   * Fetches the list of albums from the API.
   * @callback fetchAlbums
   * @returns {Promise<Array>} - A promise that resolves to an array of albums.
   */
  const fetchAlbums = useCallback(
    async (page) => {
      const res = await fetch(`https://api-rkphoto.cyclic.app/albums?page=${page}&itemsPerPage=${itemsPerPage}`)
      const data = await res.json()

      const totalItems = data.pagination?.totalItems || 0
      const albums = data.albums || []

      return { albums, totalItems }
    },
    [itemsPerPage]
  )

  // Fetch the albums and set the state on component mount
  useEffect(() => {
    /**
     * Retrieves the albums by calling fetchAlbums and updates the component state.
     * @async
     * @function getAlbums
     */
    const getAlbums = async () => {
      setIsFetching(true)
      const { albums, totalItems } = await fetchAlbums(currentPage)
      setAlbums(albums)
      setTotalItems(totalItems)
      setIsLoaded(true)
      setIsFetching(false)
    }

    getAlbums()
  }, [fetchAlbums, currentPage])

  const handlePageChange = async (newPage) => {
    setIsLoaded(false)
    setIsFetching(true)
    setCurrentPage(newPage)
    const { albums, totalItems } = await fetchAlbums(newPage)
    setAlbums(albums)
    setTotalItems(totalItems)
    setIsLoaded(true)
    setIsFetching(false)
  }

  // If the albums are not loaded yet, display the Spinner component
  if (!isLoaded || albums.length === 0) {
    return <Spinner />
  } else {
    // Render the list of album cards once the data is loaded
    return (
      <>
        <div className='albums'>
          {albums.map((album, index) => (
            <Card key={index} album={album} isFetching={isFetching} />
          ))}
        </div>
        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} onPageChange={handlePageChange} disabled={isFetching} />
      </>
    )
  }
}
